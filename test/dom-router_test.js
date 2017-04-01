var Nightmare = require("nightmare"),
	turtleio = require("turtle.io");

describe("Multi-tier", function () {
	var port = 8001,
		ms = 50;

	turtleio().start({
		port: port,
		default: "localhost",
		root: __dirname,
		vhosts: {
			localhost: "www"
		},
		logs: {
			stdout: false
		}
	});

	it("GET without hash - returns #main", function (done) {
		new Nightmare()
			.goto("http://localhost:" + port + "/")
			.wait(ms)
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
			.run(function (err) {
				if (err) {
					throw err;
				} else {
					done();
				}
			});
	});

	it("GET invalid route - returns #main", function (done) {
		new Nightmare()
			.goto("http://localhost:" + port + "/#blahblah")
			.wait(ms)
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
			.run(function (err) {
				if (err) {
					throw err;
				} else {
					done();
				}
			});
	});

	it("GET default hash - returns #main", function (done) {
		new Nightmare()
			.goto("http://localhost:" + port + "/#main")
			.wait(ms)
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
			.run(function (err) {
				if (err) {
					throw err;
				} else {
					done();
				}
			});
	});

	it("GET valid multi-tier route - returns #settings/billing", function (done) {
		new Nightmare()
			.goto("http://localhost:" + port + "/#settings/billing")
			.wait(ms)
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
			.run(function (err) {
				if (err) {
					throw err;
				} else {
					done();
				}
			});
	});
});
