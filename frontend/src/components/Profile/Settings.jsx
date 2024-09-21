import Toggler from "../Toggler/Toggler.jsx";
import { ThemeContext, themes } from "../../contexts/ThemeContext";
import FunctionMarker from "../FunctionMarker.jsx";

function Settings() {
  return (
    <div id="set-content">
      <div id="settings">
        <h3>General settings</h3>
        <div className="setting">
          <div className="title">
            <p>Dark mode</p>
            <FunctionMarker type="beta" />
          </div>
          <ThemeContext.Consumer>
            {({ theme, setTheme }) => (
              <Toggler
                onChange={() => {
                  if (theme === themes.light) setTheme(themes.dark);
                  if (theme === themes.dark) setTheme(themes.light);
                }}
                value={theme === themes.dark}
              />
            )}
          </ThemeContext.Consumer>
        </div>
      </div>
      <div id="possibilities"></div>
    </div>
  );
}

export default Settings;
