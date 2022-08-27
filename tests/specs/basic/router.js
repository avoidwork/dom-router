const path = require("path"),
	http = require("http"),
	ip = "127.0.0.1",
	port = 8001,
	url = `http://${ip}:${port}/index.html`,
	router = require("woodland")({
		defaultHeaders: {
			"cache-control": "no-cache",
			"content-type": "text/plain; charset=utf-8"
		},
		time: true
	});

router.get("/(.*)?", (req, res) => router.serve(req, res, req.parsed.pathname.substring(1), path.join(__dirname, "www")));
http.createServer(router.route).listen(port, ip);

describe("Tabbed UI Tests", function () {
	before(browser => browser.navigateTo(url));

	it("Default starting state - returns #main", function (browser) {
		browser
			.waitForElementVisible("body")
			.assert.visible("#main")
			.assert.not.visible("#settings")
			.expect.url().to.endWith("#main");
	});

	it("Click tabbed navigation - returns #settings/billing", function (browser) {
		browser
			.waitForElementVisible("body")
			.click("a[href='#settings/billing']")
			.assert.visible("#settings")
			.assert.visible("#billing")
			.assert.not.visible("#password")
			.assert.not.visible("#main")
			.expect.url().to.endWith("#settings/billing");
	});

	after(browser => {
		browser.end();
		process.exit();
	});
});
