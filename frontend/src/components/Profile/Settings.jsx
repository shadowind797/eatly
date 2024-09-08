import Toggler from "../Toggler/Toggler.jsx";
import { ThemeContext, themes } from "../../contexts/ThemeContext";

function Settings() {
  return (
    <div id="set-content">
      <div id="settings">
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
      <div id="possibilities"></div>
    </div>
  );
}

export default Settings;
