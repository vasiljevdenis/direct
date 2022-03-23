window.onload = function () {
    let nextButtons = document.querySelectorAll('.btn-success');
    let steps = document.querySelectorAll('.step');
    let mainHeight = document.querySelector('#main').offsetHeight;
    let accordion = document.querySelector('.accordion-collapse');
    const collapse = new bootstrap.Collapse(accordion, {
        toggle: false
    });
    let i = 0;

    for (let i = 0; i < steps.length; i++) {
        const element = steps[i];
        element.style.height = mainHeight + "px";
    }

    for (let i = 0; i < nextButtons.length; i++) {
        const button = nextButtons[i];
        button.addEventListener('click', scrollToId);
    }

    function scrollToId() {
        if (accordion.classList.contains('show')) collapse.toggle();
        if (i == 1) {
            const url = document.querySelector('#first input').value;
            console.log(url);
            parseSite(url);
        }
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

    function parseSite(url) {       
          
          let response = await fetch('parser.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(url)
          });
          
          let result = await response.json();
          console.log(result);
    }
}