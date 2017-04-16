const Nightmare = require("nightmare"),
	turtleio = require("turtle.io"),
	port = 8001,
	ms = 5000,
	defaults = {
		gotoTimeout: ms,
		loadTimeout: ms
	};

turtleio({
	port: port,
	default: "localhost",
	root: __dirname,
	hosts: {
		localhost: "www"
	},
	logging: {
		enabled: false
	}
}).start();

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
