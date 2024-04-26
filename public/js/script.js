function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
 
domReady(function () {
    function onScanSuccess(decodeText, decodeResult) {
        const isURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(decodeText);
        if (!isURL) {
            alert("This is not link");
            return
        }
        let url = decodeText;
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        if (url.startsWith(protocol + "//" + hostname)) {
            window.location.href = url;
        } else {
            alert(url);
        }
    }
 
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});
