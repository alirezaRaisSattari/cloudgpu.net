import { api } from '../apiModule.js';

const getStarredFAQ = async () => {
    let res = await api(`/faq/questions/starred/get`)
    res.data.forEach((e, i) => {
        document.getElementById("accordion-faq").innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${i}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                        ${e.title}
                    </button>
                </h2>
                <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}"
                    data-bs-parent="#accordion-faq">
                    <div class="accordion-body">
                        ${e.answer}
                    </div>
                </div>
            </div>
        `
    });

}

getStarredFAQ()