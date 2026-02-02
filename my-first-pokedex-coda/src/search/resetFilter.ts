export function resetFilters() {
    const inputs = document.querySelectorAll('.search-sidebar input[type="number"], .search-sidebar input[type="search"]');
    inputs.forEach(input => (input as HTMLInputElement).value = "");

    const checkboxes = document.querySelectorAll('.search-sidebar input[type="checkbox"]');
    checkboxes.forEach(check => (check as HTMLInputElement).checked = false);

    const dynamicElements = ['message-error-id', 'no-check-box-type', 'no-check-box-gen', 'list-of-abilities'];
    dynamicElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = "";
    });
}