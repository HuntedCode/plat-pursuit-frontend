document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('games-filter-form');
    const container = document.getElementById('games-container');
    const sentinel = document.getElementById('games-sentinel');
    let page = 1;
    let isLoading = false;
    let hasMore = true;

    const getParams = () => {
        const search = document.getElementById('game-search').value.trim();
        const platform = document.getElementById('platform-filter').value;
        const completion = document.getElementById('completion-filter').value;
        const plat = document.getElementById('plat-filter').value;
        const sort = document.getElementById('game-sort').value;

        let params = `page=${page}`;
        if (search) params += `&search=${encodeURIComponent(search)}`;
        if (platform) params += `&platform=${platform}`;
        if (completion) params += `&completion=${completion}`;
        if (plat) params += `&plat=${plat}`;
        if (sort) params += `&sort=${sort}`;

        console.log(params);
        return '?' + params;
    }

    let savedParams = getParams();

    const loadMore = (reset=false) => {
        if (isLoading || !hasMore) return;
        isLoading = true;
        console.log(`Loading page ?${savedParams}`);
        const username = form.dataset.username;

        fetch(`/profile/${username}/games-html${savedParams}`)
            .then(res => res.json())
            .then(data => {
                container.innerHTML += data.html;
                hasMore = data.hasMore;
                if (hasMore) page++;
                isLoading = false;
            })
            .catch(err => {
                console.error('Error loading games:', err);
                isLoading = false;
            });

        if (reset) savedParams
    };

    const resetAndReload = () => {
        container.innerHTML = '';
        page = 1;
        hasMore = true;
        savedParams = getParams();
        loadMore();
    }

    form.addEventListener('submit', (e) => {
        console.log("submitting...");
        e.preventDefault();
        resetAndReload();
    });

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });

    observer.observe(sentinel);
});