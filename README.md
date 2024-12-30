# Uptime Status Widget for OBS 📡

Easily display the uptime status of your Twitch or Kick channel on your OBS streams! This widget helps you showcase how long you've been live in a clean and customizable overlay, perfect for engaging your audience.

## Features ✨

- Works with both Twitch and Kick platforms.
- Display uptime in customizable formats (short or long).
- Add prefixes to the uptime display.
- Hide seconds for a cleaner look.
- Supports custom fonts and styles.
- Seamless integration with OBS browser sources.

## Quick Setup ⚙️

1. **Download or Use Hosted Version**:
   - Download the [`Uptime Status Widget`](https://github.com/Stream-KoolAid/Uptime-Widget/releases) file from this repository and host it on your server or use it locally in OBS.
   - Alternatively, use the hosted version at: [Uptime Status Widget Hosted Version](https://stream-koolaid.github.io/Uptime-Widget/widget/uptime.html?).
2. **Add to OBS**:
   - Open OBS. 📺
   - Add a **Browser Source** to your scene. 🔄
   - Set the URL to the hosted version or your local file path.
3. **Customize**:
   - Use our [Quick Setup Page](https://stream-koolaid.github.io/Uptime-Widget) to easily configure the widget without manual URL editing. 💡

## CSS Customization 🎨

The following font-related properties can be configured through root CSS variables in your stylesheet or within OBS's custom CSS settings:

```css
:root {
	--letter-spacing: 0px;
	--font-size: 24px;
	--font-weight: 500;
	--text-transform: none;
	--text-color: #fff;
	--text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}
```

### List of Root CSS Variables

| **Variable**       | **Description**                          |
| ------------------ | ---------------------------------------- |
| `--letter-spacing` | Letter spacing for the uptime label.     |
| `--font-size`      | Font size for the uptime label.          |
| `--font-weight`    | Font weight for the uptime label.        |
| `--text-transform` | Text transformation for the uptime text. |
| `--text-color`     | Text color for the uptime label.         |
| `--text-shadow`    | Text shadow for the uptime label.        |

## URL Customization ✍️

### List of Query Parameters

| **Category** | **Parameter** | **Description** |
| --- | --- | --- |
| **Platform Settings** | `platform` | The platform to use: `twitch` (default) or `kick`. |
| **User Information** | `username` | The username of the channel to display uptime for. |
| **Display Options** | `prefix` | Text to display before the uptime (e.g., "Live for"). |
|  | `format` | Format of uptime: `short` (default) or `long`. |
|  | `hideSeconds` | Set to `true` to hide seconds in the uptime display. |
| **Font Settings** | `fontFamily` | Font family for the uptime label. |

### Example URL 🔗

```
https://stream-koolaid.github.io/Uptime-Widget/widget/uptime.html?platform=twitch&username=kaicenat&prefix=Live%20for&format=long&hideSeconds=true&fontFamily=Arial
```

## Contributing ✨

We welcome contributions! Feel free to submit issues or pull requests to help improve this project.

## License 🔒

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy streaming! 🎮 If you encounter any issues or have suggestions, please let us know. 📢
