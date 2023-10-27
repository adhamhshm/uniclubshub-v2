import "./leftbar.scss";

import { NavLink } from "react-router-dom";
import { clubUserLinks, participantUserLinks } from "../../constants/navlinks";

const LeftBar = ({ currentUser }) => {

    // Render different navigation links based on the user's role
    const userLinks = currentUser.role === 'club' ? clubUserLinks : participantUserLinks;

    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <div className="menu-list">
                        {/* links will be rendered based on the role */}
                        {userLinks.map((link, index) => (
                            <NavLink
                                className="navlinks"
                                key={index}
                                to={link.to.replace(':id', currentUser.id)}
                                activeclassname ="active"
                                style={{ textDecoration: "none", color: "inherit" }}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <span><img src={link.icon} alt={link.text} /></span>
                                <span>{link.text}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LeftBar;