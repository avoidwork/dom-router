module.exports = {
	src_folders: ["tests/specs"],
	page_objects_path: ["tests/page-objects"],
	custom_commands_path: ["tests/custom-commands"],
	custom_assertions_path: ["tests/custom-assertions"],
	globals_path: "",
	webdriver: {},
	test_settings: {
		default: {
			disable_error_log: false,
			launch_url: "http://localhost:8000/",
			screenshots: {
				enabled: false,
				path: "screens",
				on_failure: true
			},
			desiredCapabilities: {
				browserName: "chrome"
			},
			webdriver: {
				start_process: true,
				server_path: ""
			}
		},
		chrome: {
			desiredCapabilities: {
				browserName: "chrome",
				"goog:chromeOptions": {
					w3c: true,
					args: [
						//"--no-sandbox",
						//"--ignore-certificate-errors",
						//"--allow-insecure-localhost",
						//"--headless"
					]
				}
			},
			webdriver: {
				start_process: true,
				server_path: "",
				cli_args: []
			}
		}
	}
};
