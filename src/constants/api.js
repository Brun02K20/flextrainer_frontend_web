let API = "";

if (window.location.href.includes("flextrainer")) {
    API = "https://flextrainer.com.ar/api";
} else {
    API = "http://localhost:4001";
}

console.log("la API va a ser esta: ", API)

export { API };