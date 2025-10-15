document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trophies-filter-form');
    const container = document.getElementById('trophies-container');
    const sentinel = document.getElementById('trophies-sentinel');
    let page = 1;
    let isLoading = false;
    let hasMore = true;

    const getParams = () => {
        const search = document.getElementById('trophy-search').value.trim();
        const type = document.getElementById('trophies-type-filter').value;
        const rarity = document.getElementById('trophies-rarity-filter').value;
        const platform = document.getElementById('trophies-platform-filter').value;
        const sort = document.getElementById('trophy-sort').value;

        let params = `page=${page}`;
        if (search) params += `&search=${encodeURIComponent(search)}`;
        if (type) params += `&type=${type}`;
        if (rarity) params += `&rarity=${rarity}`;
        if (platform) params += `&platform=${platform}`;
        if (sort) params += `&sort=${sort}`;

        console.log(params);
        return '?' + params;
    }

    let savedParams = getParams();

    const loadMore = () => {
        if (isLoading || !hasMore) return;
        isLoading = true;
        const username = form.dataset.username;

        fetch(`/profile/${username}/trophies-html${savedParams}`)
            .then(res => res.json())
            .then(data => {
                container.innerHTML += data.html;
                hasMore = data.hasMore;
                if (hasMore) {
                    page++;
                    savedParams = getParams();
                }
                isLoading = false;
            })
            .catch(err => {
                console.error('Error loading games:', err);
                isLoading = false;
            });
    };

    const resetAndReload = () => {
        container.innerHTML = '';
        page = 1;
        hasMore = true;
        savedParams = getParams();
        loadMore();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        resetAndReload();
    });

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });

    observer.observe(sentinel);
});