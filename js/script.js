window.onload = function () {
    const nextButtons = document.querySelectorAll('.btn-success');
    const steps = document.querySelectorAll('.step');
    const mainHeight = document.querySelector('#main').offsetHeight;
    const accordion = document.querySelector('.accordion-collapse');
    const adForm = document.querySelector('#ad');
    const collapse = new bootstrap.Collapse(accordion, {
        toggle: false
    });
    let i = 0;

    for (let i = 0; i < steps.length; i++) {
        if (i != 5) {
            const element = steps[i];
            element.style.height = mainHeight + "px";
        }
    }

    adForm.site.addEventListener('blur', function () {
        let val = this.value;
        if (!val.startsWith('http') && val.length != 0) this.value = 'http://' + val;
        if (!val.endsWith('/') && val.length != 0) this.value += "/";
    });

    nextButtons[0].addEventListener('click', scrollToId);
    nextButtons[1].addEventListener('click', getContent);
    nextButtons[2].addEventListener('click', scrollToId);
    nextButtons[3].addEventListener('click', scrollToId);
    nextButtons[4].addEventListener('click', scrollToId);
    nextButtons[5].addEventListener('click', scrollToId);
    nextButtons[6].addEventListener('click', scrollToId);
    nextButtons[7].addEventListener('click', scrollToId);

    function scrollToId() {
        if (accordion.classList.contains('show')) collapse.toggle();
        steps[i].classList.remove('off');
        steps[i].classList.add('on');

        let target = steps[i];
        if (target !== null) {
            let pos = target.offsetTop;

            window.scrollTo({
                top: pos,
                behavior: "smooth"
            });
        }
        nextButtons[i].setAttribute('disabled', 'disabled');
        i++;
    }

    async function parseSite(site) {
        let url = 'parse.php';
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                url: site
            })
        });
        let res = await response.text();
        return res;
    }
    async function parseImages(arr) {
        let url = 'getImage.php';
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(arr)
        });
        let res = await response.json();
        return res;
    }

    async function getContent() {
        const loading = document.querySelector('#loading');
        this.classList.add('d-none');
        loading.classList.remove('d-none');
        let site = adForm.site.value;
        let html = await parseSite(site);
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        console.log(doc);
        let title = doc.querySelector('title') ? doc.querySelector('title').innerHTML : "";
        let varDescr = doc.querySelector('meta[name="description"]');
        let description = varDescr ? varDescr.getAttribute('content') : doc.querySelector('meta[name="Description"]') ? doc.querySelector('meta[name="Description"]').getAttribute('content') : "";
        let sentence = description.split('.');
        let h1 = doc.querySelector('h1') ? doc.querySelector('h1').innerHTML : "";
        let img = doc.querySelectorAll('img');
        let imgDivOrig = doc.querySelectorAll('div[data-original]');
        let imgDivSrc = doc.querySelectorAll('div[data-src]');
        putAds(title, sentence, description, h1);
        this.classList.remove('d-none');
        loading.classList.add('d-none');
        scrollToId();
        putImages(img, imgDivOrig, imgDivSrc, site);
    }

    function putAds(title, sentence, description, h1) {
        adForm.title1.value = title;
        adForm.title2.value = sentence[0];
        adForm.title3.value = sentence[1];
        adForm.ad1.value = description;
        adForm.ad2.value = title + h1;
        adForm.ad3.value = title + sentence[1];
    }

    async function putImages(img, imgDivOrig, imgDivSrc, site) {
        let arrImg = [];
        const srcGenerator = (element, attr) => {
            let elemSrc = element.getAttribute(attr).toLowerCase();
            if (elemSrc.startsWith('http') || elemSrc.startsWith('//')) arrImg.push(elemSrc);
            else if (elemSrc.length < 5) elemSrc;
            else arrImg.push(site + elemSrc);
        }
        if (img) {
            for (let i = 0; i < img.length; i++) {
                const element = img[i];
                if (element.hasAttribute('src')) srcGenerator(element, 'src');
                else if (element.hasAttribute('data-original')) srcGenerator(element, 'data-original');
            }
        }
        if (imgDivOrig) {
            for (let i = 0; i < imgDivOrig.length; i++) {
                const element = imgDivOrig[i];
                if (element.hasAttribute('data-original')) srcGenerator(element, 'data-original');
            }
        }
        if (imgDivSrc) {
            for (let i = 0; i < imgDivSrc.length; i++) {
                const element = imgDivSrc[i];
                if (element.hasAttribute('data-src')) srcGenerator(element, 'data-src');
            }
        }
        let res = await parseImages(arrImg);
        
        arrImg = res.filter(function(elem, pos) {
            return res.indexOf(elem) == pos;
        });
        console.log(arrImg);
        const images = document.querySelector('#images');
        const divImg = `<div class="col-12 col-md-6 col-lg-3 m-1 p-0 border rounded"><img src="" alt="Вариант картинки" class="rounded"></div>`.repeat(arrImg.length);
        images.innerHTML = divImg;
        let imgCollection = images.querySelectorAll('img');
        for (let i = 0; i < imgCollection.length; i++) {
            const element = imgCollection[i];
            element.src = arrImg[i];
        }
    }
    
    let statusForm = false;

    adForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (statusForm) return;
        statusForm = true;
        adForm.submit.setAttribute('disabled', 'disabled');

        let data = new FormData(adForm);

        let url = 'excel.php';

        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                adForm.classList.add('d-none');
                let res = JSON.parse(xhr.response);
                window.open(res);
            }
        }
        xhr.onerror = function () {
            adForm.submit.removeAttribute('disabled');
            statusForm = false;
        }
        xhr.send(data);
    });

}