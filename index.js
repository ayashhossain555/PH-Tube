const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('card-container');
const errorEl = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');
let selectedCategory = 1000;
let sorted = false;

sortBtn.addEventListener('click', () => {
    sorted = true;
    fetchDataByCategories(selectedCategory, sorted);
})

const fetchCategories = () => {
    const url = "https://openapi.programming-hero.com/api/videos/categories";
    fetch(url)
        .then((res) => res.json())
        .then(({data}) => {
            data.forEach((card) => {
                const newBtn = document.createElement('button');
                newBtn.classList = 'category-btn btn btn-error hover:bg-[#FF1F3D] hover:text-white bg-slate-200 border-none text-lg';
                newBtn.innerText = card.category;
                newBtn.addEventListener('click',()=> {
                    fetchDataByCategories(card.category_id);
                    const allBtns = document.querySelectorAll('.category-btn');
                    for(const btn of allBtns){
                        btn.classList.remove('bg-[#FF1F3D]');
                    }
                    newBtn.classList.add('bg-[#FF1F3D]');
                });
                btnContainer.appendChild(newBtn);
            })
        })
}

const fetchDataByCategories = (categoryId, sorted) =>{
    selectedCategory = categoryId;
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
    fetch(url)
        .then((res) => res.json())
        .then(({data}) => {
            if(sorted){
                data.sort((a,b) => {
                    const sFirst = parseFloat((a.others?.views).replace("K","") || 0);
                    const sSecond = parseFloat((b.others?.views).replace("K","") || 0);
                    return sSecond-sFirst;
                })
            }
            if(data.length === 0){
                errorEl.classList.remove('hidden');
            }else{
                errorEl.classList.add('hidden');
            }
            cardContainer.innerHTML = '';
            data.forEach((video) => {
                let verifiedBadge = '';
                if(video.authors[0].verified){
                    verifiedBadge = `<img class="w-6 h-6" src="./assets/verify.png" alt="">`;
                }
                const newCard = document.createElement('div');
                newCard.innerHTML = `
                <div class="card w-full bg-base-100 shadow-xl">
                    <figure class="overflow-hidden h-72">
                        <img class="w-full" src="${video.thumbnail}" alt="Shoes" />
                        <h6 class="absolute bottom-[40%] right-12">0 hr</h6>
                    </figure>
                    <div class="card-body">
                        <div class="flex space-x-4 justify-start items-start">
                            <div>
                                <img class="w-12 h-12 rounded-full" src="${video.authors[0].profile_picture}" alt="Shoes" />
                            </div>
                            <div>
                                <h2 class="card-title">${video.title}</h2>
                                <div class="flex mt-3">
                                    <p class="">${video.authors[0].profile_name}</p>
                                    ${verifiedBadge}
                                </div>
                                <p class="mt-3">${video.others.views}</p>
                            </div>
                        </div>
                    </div>
                </div>
                `
                // newBtn.addEventListener('click',()=> fetchDataByCategories(card.category_id));
                cardContainer.appendChild(newCard);
            })
        })
}

fetchCategories();
fetchDataByCategories(selectedCategory, sorted);