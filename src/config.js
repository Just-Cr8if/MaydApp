export const environment = "production";

export const PEGASUS_API_BASE_URL = "https://mobylmenu-pegasus-7c9da5dbb688.herokuapp.com/api"
export const MOBYLMENU_API_BASE_URL = environment === "development" ? "http://127.0.0.1:8000/api" : "https://www.mobylmenu.com/api";
export const ORS_MOBYLMENU_ROUTING_API_KEY = "5b3ce3597851110001cf62489ce1aed6a6b24340ab6ae30ad11788da"
export const WEBSOCKET_URL = environment === "development" ? "ws://127.0.0.1:8000/ws/" : "ws://mobylmenu-websocket-service-cee5b939adf4.herokuapp.com/ws/";