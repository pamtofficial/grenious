var annotationData = [];

async function getLyrics(title) {
    var urlBase = "songs/"

    try {
        const response = await fetch(urlBase + decodeURI(title) + ".xml");
        if (!response.ok) {
            document.getElementById("lyrics").innerHTML = `<p style="font-size: 100px;">OOOPS!!!</p>
            <p>The song "${title}" could not be found!</p>`
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
        var title = xml.getElementsByTagName("title")[0].innerText;
        xml.getElementsByTagName("title")[0].remove();

        try {
            var author = xml.getElementsByTagName("author")[0].innerText;
            xml.getElementsByTagName("author")[0].remove();
        } catch (e) {
            console.warn("Author not listed");
        }

        var work = null;
        try {
            work = xml.getElementsByTagName("work")[0].innerText;
            xml.getElementsByTagName("work")[0].remove();
        } catch (e) {
            console.warn("Work not listed");
        }

        document.getElementById("songtitle").innerText = title
        document.getElementById('title').innerText = `${title} - Grẽnious`;
        document.getElementById("author").innerText = author;
        if (work) {
            document.getElementById("author").innerHTML += `, <i>${work}</i>`
        }
        

        console.log(xml)

        document.getElementById("lyrics").innerHTML = xml.innerHTML;

    } catch (error) {
        console.error(error.message);
    }
}

getLyrics(new URLSearchParams(window.location.search).get("song"));

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