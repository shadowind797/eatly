from django.conf import settings
from django.shortcuts import redirect
from django.core.exceptions import ValidationError
from urllib.parse import urlencode
from typing import Dict, Any
import requests
from .models import User
import jwt

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

GITHUB_ACCESS_TOKEN_OBTAIN_URL = 'https://github.com/login/oauth/access_token'
GITHUB_USER_INFO_URL = 'https://api.github.com/user'

LOGIN_URL = f'{settings.BASE_APP_URL}/login'


def google_get_access_token(code: str, redirect_uri: str) -> str:
    data = {
        'code': code,
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)
    if not response.ok:
        raise ValidationError('Could not get access token from Google.')

    access_token = response.json()['access_token']

    return access_token


def google_get_user_info(access_token: str) -> Dict[str, Any]:
    response = requests.get(
        GOOGLE_USER_INFO_URL,
        params={'access_token': access_token}
    )

    if not response.ok:
        raise ValidationError('Could not get user info from Google.')

    return response.json()


def github_get_access_token(code: str, redirect_uri: str) -> str:
    headers = {
        "Accept": "application/json"
    }
    data = {
        'code': code,
        'client_id': settings.GITHUB_OAUTH2_CLIENT_ID,
        'client_secret': settings.GITHUB_OAUTH2_CLIENT_SECRET,
        'redirect_uri': redirect_uri
    }

    response = requests.post(GITHUB_ACCESS_TOKEN_OBTAIN_URL, headers=headers, data=data)
    if not response.ok:
        raise ValidationError('Could not get access token from Github.')

    access_token = response.json()['access_token']

    return access_token


def github_get_user_info(access_token: str) -> Dict[str, Any]:
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(
        GITHUB_USER_INFO_URL,
        headers=headers
    )

    if not response.ok:
        raise ValidationError('Could not get user info from Github.')

    return response.json()


def get_user_data(validated_data, platform):
    domain = settings.BASE_API_URL
    redirect_uri = f'{domain}/api/login/{platform}/'

    code = validated_data.get('code')
    error = validated_data.get('error')
    state = validated_data.get('state')

    if error or not code:
        params = urlencode({'error': error})
        return redirect(f'{LOGIN_URL}?{params}')

    if platform == "google":
        access_token = google_get_access_token(code=code, redirect_uri=redirect_uri)
        user_data = google_get_user_info(access_token=access_token)

        user, created = User.objects.get_or_create(
            email=user_data['email'],
        )

        if not created:
            user.username = user_data['name']
            user.save()

        profile_data = {
            'email': user_data['email'],
        }
        return profile_data
    elif platform == "github":
        access_token = github_get_access_token(code=code, redirect_uri=redirect_uri)
        user_data = github_get_user_info(access_token=access_token)

        print(user_data)

        User.objects.get_or_create(
            username=user_data['login'],
        )

        profile_data = {
            'username': user_data['login'],
        }
        return profile_data
