/// <reference path="../../src/bobril.d.ts"/>
/// <reference path="../../src/bobril.router.d.ts"/>
/// <reference path="../../src/bobril.promise.d.ts"/>
var RouterApp;
(function (RouterApp) {
    function h(tag) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return { tag: tag, children: args };
    }
    var needLogin = true;
    function checkAuthorization(tr) {
        if (needLogin) {
            // Faking calling API to check if logged in
            return new Promise(function (resolve, reject) {
                console.log("Faked call to check if logged in");
                setTimeout(function () {
                    console.log("Ha! We are not logged in.");
                    resolve(b.createRedirectPush("login"));
                }, 1000);
            });
        }
        else {
            return true;
        }
    }
    var Page1 = {
        id: "Page1",
        canActivate: checkAuthorization,
        init: function (ctx, me) {
            ctx.ticks = 0;
            ctx.timer = setInterval(function () { ctx.ticks++; b.invalidate(); }, 1000);
        },
        render: function (ctx, me) {
            me.tag = "div";
            me.children = [h("h3", "Page1"), h("p", "Ticks :" + ctx.ticks)];
        },
        destroy: function (ctx, me) {
            clearInterval(ctx.timer);
        }
    };
    var PageLogin = {
        id: "PageLogin",
        init: function (ctx) {
            ctx.loginInProgress = false;
        },
        render: function (ctx, me) {
            me.tag = "div";
            me.children = [h("h3", "Please Login"), {
                    tag: "button", attrs: { disabled: ctx.loginInProgress }, children: "Fake login", component: {
                        onClick: function (ctx) {
                            b.invalidate();
                            ctx.loginInProgress = true;
                            setTimeout(function () {
                                needLogin = false;
                                ctx.loginInProgress = false;
                                var tr = b.createBackTransition();
                                if (!tr.inApp) {
                                    tr = b.createRedirectReplace("root");
                                }
                                b.runTransition(tr);
                            }, 3000);
                        }
                    }
                }];
        }
    };
    var App = {
        render: function (ctx, me) {
            me.tag = "div";
            me.children = [
                h("h1", "Router sample with login"),
                h("ul", h("li", b.link(h("a", "Page 1 - needs to be logged in"), "page1")), h("li", b.link(h("a", "Login"), "login"))),
                me.data.activeRouteHandler()
            ];
        }
    };
    b.routes(b.route({ name: "root", url: "/", handler: App }, [
        b.route({ name: "page1", handler: Page1 }),
        b.route({ name: "login", handler: PageLogin })
    ]));
})(RouterApp || (RouterApp = {}));