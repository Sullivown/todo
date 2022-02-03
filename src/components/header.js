function render() {
    const body = document.querySelector('body');

    const header = document.createElement('header');
    header.textContent = 'This is the header';
    body.appendChild(header);
}