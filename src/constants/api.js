let API = "";

if (window.location.href.includes("flextrainer")) {
    API = "api";
} else {
    API = "http://localhost:4001";
}

export { API };