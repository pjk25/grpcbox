load("@rules_erlang//:erlang_bytecode2.bzl", "erlang_bytecode", "erlc_opts")
load("@rules_erlang//:erlang_app.bzl", "erlang_app")

erlc_opts(
    name = "erlc_opts",
    values = select({
        "@rules_erlang//:debug_build": [
            "+debug_info",
        ],
        "//conditions:default": [
            "+debug_info",
            "+deterministic",
        ],
    }),
    visibility = [":__subpackages__"],
)

erlang_bytecode(
    name = "other_beam",
    srcs = glob(["src/**/*.erl"]),
    hdrs = [":public_and_private_hdrs"],
    app_name = "jsx",
    dest = "ebin",
    erlc_opts = "//:erlc_opts",
)

filegroup(
    name = "beam_files",
    srcs = [":other_beam"],
)

filegroup(
    name = "srcs",
    srcs = glob([
        "src/**/*.app.src",
        "src/**/*.erl",
    ]),
)

filegroup(
    name = "private_hdrs",
    srcs = glob(["src/**/*.hrl"]),
)

filegroup(
    name = "public_hdrs",
    srcs = glob(["include/**/*.hrl"]),
)

filegroup(
    name = "priv",
    srcs = glob(["priv/**/*"]),
)

filegroup(
    name = "license_files",
    srcs = glob(["LICENSE*"]),
)

filegroup(
    name = "public_and_private_hdrs",
    srcs = [
        ":private_hdrs",
        ":public_hdrs",
    ],
)

filegroup(
    name = "all_srcs",
    srcs = [
        ":public_and_private_hdrs",
        ":srcs",
    ],
)

erlang_app(
    name = "erlang_app",
    srcs = [":all_srcs"],
    hdrs = [":public_hdrs"],
    app_name = "jsx",
    beam_files = [":beam_files"],
    license_files = [":license_files"],
    priv = [":priv"],
)

alias(
    name = "jsx",
    actual = ":erlang_app",
    visibility = ["//visibility:public"],
)
