import {join} from "node:path";
import {createServer} from "node:http";
import {fileURLToPath} from "node:url";
import {default as woodland} from "woodland";

const ip = "127.0.0.1",
	port = 8001,
	__dirname = fileURLToPath(new URL(".", import.meta.url)),
	webroot = join(__dirname, "www"),
	url = `http://${ip}:${port}/index.html?abc=true`,
	router = woodland({
		defaultHeaders: {
			"cache-control": "no-cache",
			"content-type": "text/plain; charset=utf-8"
		},
		logging: {
			enabled: false
		},
		time: false
	});

router.get("/.*?", (req, res) => router.serve(req, res, req.parsed.pathname.substring(1), webroot));
createServer(router.route).listen(port, ip);

describe("Tabbed UI Tests (default settings)", function () {
	before(browser => browser.navigateTo(new URL(url).href));

	it("Default starting state - returns #main", function (browser) {
		browser
			.waitForElementVisible("body")
			.assert.visible("#main")
			.assert.not.visible("#settings")
			.expect.url().to.endWith("#main").to.not.contain("abc=true");
	});

	it("Click tabbed navigation - returns #settings/billing", function (browser) {
		browser
			.waitForElementVisible("body")
			.click("a[href='#settings/billing']")
			.assert.visible("#settings")
			.assert.visible("#billing")
			.assert.not.visible("#password")
			.assert.not.visible("#main")
			.expect.url().to.endWith("#settings/billing").to.not.contain("abc=true");
	});

	it("Sticky routing - returns #settings/billing", function (browser) {
		browser
			.waitForElementVisible("body")
			.assert.visible("#settings")
			.assert.visible("#billing")
			.assert.not.visible("#password")
			.assert.not.visible("#main")
			.expect.url().to.endWith("#settings/billing").to.not.contain("abc=true");
	});

	after(browser => {
		browser.end();
		process.exit();
	});
});
