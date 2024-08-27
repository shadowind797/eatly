import github from "../../assets/github.svg";

const onGithubLoginSuccess = () => {
    const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
    const REDIRECT_URI = 'api/login/github/';

    const scope = [
        'user',
    ].join(' ');

    const params = {
        response_type: 'code',
        client_id: import.meta.env.VITE_GITHUB_OAUTH2_CLIENT_ID,
        redirect_uri: `${import.meta.env.VITE_API_URL}/${REDIRECT_URI}`,
        prompt: 'select_account',
        access_type: 'offline',
        scope
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location = `${GITHUB_AUTH_URL}?${urlParams}`;
};

const LoginButton = () => {
    return <button id="git-hub" onClick={onGithubLoginSuccess}><img src={github} alt=""/></button>
}

export default LoginButton