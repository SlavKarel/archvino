function shouldReduceMotion(): boolean {
  return document.documentElement.dataset.motion === 'reduce';
}

function showItem(item: HTMLElement): void {
  item.hidden = false;

  if (shouldReduceMotion()) {
    item.dataset.filterState = 'visible';

    return;
  }

  item.dataset.filterState = 'revealing';

  window.requestAnimationFrame(() => {
    item.dataset.filterState = 'visible';
  });
}

function hideItem(item: HTMLElement): void {
  item.dataset.filterState = 'hidden';
  item.hidden = true;
}

export default function initProjectFilters(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-project-grid-section]');

  sections.forEach((section) => {
    const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-project-filter]'));
    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-project-item]'));

    if (buttons.length === 0 || items.length === 0) {
      return;
    }

    const setActiveFilter = (value: string, options?: { immediate?: boolean }) => {
      buttons.forEach((button) => {
        const isActive = button.dataset.projectFilter === value;
        button.setAttribute('aria-pressed', String(isActive));
      });

      items.forEach((item) => {
        const category = item.dataset.projectCategory;
        const isVisible = value === 'all' || category === value;

        if (isVisible) {
          if (options?.immediate) {
            item.hidden = false;
            item.dataset.filterState = 'visible';

            return;
          }

          showItem(item);

          return;
        }

        hideItem(item);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.projectFilter;

        if (!value) {
          return;
        }

        setActiveFilter(value);
      });
    });

    setActiveFilter('all', { immediate: true });
  });
}
