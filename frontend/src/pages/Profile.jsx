import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";
import ProfileContent from "../components/Profile/ProfileContent.jsx";

function Profile() {
    return (
        <div id="profile">
            <Header />
            <BaseHeader />
            <ProfileContent />
            <Footer />
        </div>
    )
}

export default Profile