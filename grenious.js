var annotationData = [];

async function getLyrics() {
    var title = "Candy"
    var urlBase = "songs/"

    try {
        const response = await fetch(urlBase + title + ".xml");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const xml_dat = await response.text();
        console.log(xml_dat);

        // Parse xml
        var xml = document.createElement("xml")
        xml.innerHTML = xml_dat;

        an_els = xml.getElementsByTagName("an");
        ctr = 0;
        for (let i of an_els) {
            i.setAttribute("onclick", "tripAnnotation(" + ctr + ")");
            let obj = {}
            obj['annotation'] = i.getElementsByTagName('in')[0].innerHTML.trim();
            i.getElementsByTagName('in')[0].remove();
            obj['text'] = i.innerHTML.trim();
            annotationData.push(obj);
            ctr++;
        }

        document.getElementById("songtitle").innerText = xml.getElementsByTagName("title")[0].innerText;
        xml.getElementsByTagName("title")[0].remove();
        document.getElementById("author").innerText = xml.getElementsByTagName("author")[0].innerText;
        xml.getElementsByTagName("author")[0].remove();

        console.log(xml)

        document.getElementById("lyrics").innerHTML = xml.innerHTML;

    } catch (error) {
        console.error(error.message);
    }
}

getLyrics();

function tripAnnotation(line) {
    var container = document.getElementById("anContainer");
    var annotation = document.getElementById("annotation");

    annotation.innerHTML = `<an class="annotation">${annotationData[line].text}</an><br><br><div>${annotationData[line].annotation}</div>`
    container.style.display = "inline-block";
}

function closeAnnotation() {
    var container = document.getElementById("anContainer");
    container.style.display = "none";
}