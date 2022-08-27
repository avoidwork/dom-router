"use strict";

const http = require("http"),
	ip = "127.0.0.1",
	port = 8001,
	ms = 5000,
	defaults = {
		gotoTimeout: ms,
		loadTimeout: ms
	},
	router = require("woodland")({
		defaultHeaders: {
			"cache-control": "no-cache",
			"content-type": "text/plain; charset=utf-8"
		},
		time: true
	});

router.get("/(.*)?", (req, res) => router.serve(req, res, req.parsed.pathname.substring(1)));
http.createServer(router.route).listen(port, ip);

describe("Multi-tier", function () {
	it("GET without hash - returns #main", function () {
		new Nightmare(defaults)
			.goto("http://localhost:" + port + "/")
			.visible("#main", function (result) {
				if (!result) {
					throw new Error("#main is not visible");
				}
			})
			.visible("#settings", function (result) {
				if (result) {
					throw new Error("#settings is visible");
				}
			})
			.end()
			.then(arg => arg);
	});

	it("GET invalid route - returns #main", function () {
		new Nightmare(defaults)
			.goto("http://localhost:" + port + "/#blahblah")
			.visible("#main", function (result) {
				if (!result) {
					throw new Error("#main is not visible");
				}
			})
			.visible("#settings", function (result) {
				if (result) {
					throw new Error("#settings is visible");
				}
			})
			.end()
			.then(arg => arg);
	});

	it("GET default hash - returns #main", function () {
		new Nightmare(defaults)
			.goto("http://localhost:" + port + "/#main")
			.visible("#main", function (result) {
				if (!result) {
					throw new Error("#main is not visible");
				}
			})
			.visible("#settings", function (result) {
				if (result) {
					throw new Error("#settings is visible");
				}
			})
			.end()
			.then(arg => arg);
	});

	it("GET valid multi-tier route - returns #settings/billing", function () {
		new Nightmare(defaults)
			.goto("http://localhost:" + port + "/#settings/billing")
			.visible("#main", function (result) {
				if (result) {
					throw new Error("#main is visible");
				}
			})
			.visible("#settings", function (result) {
				if (!result) {
					throw new Error("#settings is not visible");
				}
			})
			.visible("#billing", function (result) {
				if (!result) {
					throw new Error("#billing is not visible");
				}
			})
			.visible("#avatar", function (result) {
				if (result) {
					throw new Error("#avatar is visible");
				}
			})
			.end()
			.then(arg => arg);
	});
});
