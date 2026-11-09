/**
 * StudySpace — Script Interaktivitas Antarmuka (Tugas 2)
 * Mengelola:
 * 1. Toggle menu navigasi mobile
 * 2. Validasi dan pencarian tempat belajar berdasarkan kata kunci
 * 3. Filter dinamis berdasarkan fasilitas (checkbox) dan suasana (radio)
 * 4. Toggle simpan tempat ke daftar Favorit & pembaruan penghitung (counter)
 * 5. Modal pratinjau detail tempat belajar
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Seleksi Elemen DOM Utama ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchFeedback = document.getElementById('search-feedback');

  const facilityCheckboxes = document.querySelectorAll('input[name="facility"]');
  const vibeRadios = document.querySelectorAll('input[name="vibe"]');
  const applyFilterBtn = document.getElementById('apply-filter-btn');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const inlineResetBtn = document.getElementById('inline-reset-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  const resultsHeading = document.getElementById('results-heading');
  const resultsSubtitle = document.getElementById('results-subtitle');
  const placeCards = document.querySelectorAll('.place-card');
  const emptyState = document.getElementById('empty-state');
  const filterFootnote = document.getElementById('filter-footnote');

  const favCounter = document.getElementById('fav-counter');
  const saveButtons = document.querySelectorAll('.btn-save');

  const detailButtons = document.querySelectorAll('.detail-btn');
  const detailModal = document.getElementById('detail-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalAddress = document.getElementById('modal-address');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  // State penyimpanan ID tempat favorit
  const savedFavorites = new Set();

  // =========================================================================
  // 1. TOGGLE MENU NAVIGASI MOBILE
  // =========================================================================
  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('is-open');
    });
  }

  // =========================================================================
  // 2. LOGIKA FILTER MULTI-KRITERIA & PENCARIAN
  // =========================================================================
  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();

    // Ambil semua fasilitas yang dicentang
    const selectedFacilities = Array.from(facilityCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    // Ambil suasana yang dipilih
    const selectedVibeRadio = Array.from(vibeRadios).find((r) => r.checked);
    const selectedVibe = selectedVibeRadio ? selectedVibeRadio.value : null;

    let visibleCount = 0;
    const hiddenBecauseNoWifi = [];

    placeCards.forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const address = card.dataset.address.toLowerCase();
      const cardFacilities = card.dataset.facilities.split(',');
      const cardVibe = card.dataset.vibe;

      // Cek kecocokan kata kunci
      const matchesKeyword =
        keyword === '' || name.includes(keyword) || address.includes(keyword);

      // Cek apakah kartu memiliki SEMUA fasilitas yang dipilih pengguna
      const matchesFacilities = selectedFacilities.every((fac) =>
        cardFacilities.includes(fac)
      );

      // Cek kecocokan suasana
      const matchesVibe = !selectedVibe || cardVibe === selectedVibe;

      // Catat jika tempat disembunyikan khusus karena Wi-Fi tidak tersedia
      if (
        selectedFacilities.includes('Wi-Fi') &&
        !cardFacilities.includes('Wi-Fi')
      ) {
        hiddenBecauseNoWifi.push(card.dataset.name);
      }

      if (matchesKeyword && matchesFacilities && matchesVibe) {
        card.hidden = false;
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    // Perbarui teks judul dan subjudul hasil pencarian sesuai kondisi filter
    updateResultsSummary(visibleCount, selectedFacilities, selectedVibe, keyword);

    // Tampilkan atau sembunyikan empty state
    emptyState.hidden = visibleCount > 0;

    // Tampilkan catatan kaki kontekstual seperti pada Wireframe Filter Pencarian Aktif
    if (hiddenBecauseNoWifi.length > 0 && visibleCount > 0) {
      filterFootnote.textContent = `${hiddenBecauseNoWifi.join(', ')} tidak ditampilkan karena Wi-Fi tidak tersedia pada data contoh.`;
      filterFootnote.hidden = false;
    } else {
      filterFootnote.textContent =
        'Seluruh tempat dan alamat merupakan data contoh. Periksa kembali informasi sebelum berkunjung.';
      filterFootnote.hidden = false;
    }
  }

  /**
   * Memperbarui teks ringkasan jumlah tempat dan filter aktif
   */
  function updateResultsSummary(count, facilities, vibe, keyword) {
    if (facilities.length > 0) {
      const facText = facilities.join(' & ');
      resultsHeading.textContent = `Menampilkan ${count} tempat dengan ${facText}`;
    } else {
      resultsHeading.textContent = `Menampilkan ${count} tempat belajar`;
    }

    const facilityInfo =
      facilities.length > 0
        ? `${facilities.length} fasilitas dipilih`
        : 'Semua fasilitas';
    const vibeInfo = vibe ? `Suasana: ${vibe}` : 'Suasana belum dibatasi';
    const keywordInfo = keyword ? ` · Kata kunci: "${keyword}"` : '';

    resultsSubtitle.textContent = `${facilityInfo} · ${vibeInfo}${keywordInfo}`;
  }

  // =========================================================================
  // 3. VALIDASI FORM PENCARIAN
  // =========================================================================
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const rawQuery = searchInput.value.trim();

    // Validasi sederhana: cegah input karakter spesial berbahaya atau terlalu pendek (1 huruf)
    if (rawQuery.length === 1) {
      searchFeedback.textContent =
        'Masukkan minimal 2 karakter untuk mencari nama tempat atau lokasi.';
      searchFeedback.hidden = false;
      return;
    }

    searchFeedback.hidden = true;
    applyFilters();
  });

  // Pencarian langsung saat input dikosongkan
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      searchFeedback.hidden = true;
      applyFilters();
    }
  });

  // Event tombol Terapkan Filter & perubahan langsung pada chip
  applyFilterBtn.addEventListener('click', applyFilters);

  // Fungsi mereset seluruh filter ke keadaan semua tempat tampil
  function resetAllFilters() {
    searchInput.value = '';
    searchFeedback.hidden = true;
    facilityCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
    vibeRadios.forEach((r) => {
      r.checked = false;
    });
    applyFilters();
  }

  resetFilterBtn.addEventListener('click', resetAllFilters);
  inlineResetBtn.addEventListener('click', resetAllFilters);
  emptyResetBtn.addEventListener('click', resetAllFilters);

  // =========================================================================
  // 4. INTERAKTIVITAS SIMPAN FAVORIT & PENGHITUNG (COUNTER)
  // =========================================================================
  saveButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.place-card');
      const placeId = card.dataset.id;
      const saveLabel = btn.querySelector('.save-label');
      const isSaved = btn.getAttribute('aria-pressed') === 'true';

      if (isSaved) {
        savedFavorites.delete(placeId);
        btn.setAttribute('aria-pressed', 'false');
        saveLabel.textContent = 'Simpan';
      } else {
        savedFavorites.add(placeId);
        btn.setAttribute('aria-pressed', 'true');
        saveLabel.textContent = 'Tersimpan';
      }

      // Perbarui badge counter di navigasi atas
      favCounter.textContent = String(savedFavorites.size);
    });
  });

  // =========================================================================
  // 5. MODAL DETAIL TEMPAT BELAJAR
  // =========================================================================
  function openModal(placeName, placeAddress) {
    modalTitle.textContent = placeName;
    modalAddress.textContent = `Alamat fiktif: ${placeAddress}`;
    detailModal.hidden = false;
    detailModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    detailModal.hidden = true;
    detailModal.setAttribute('aria-hidden', 'true');
  }

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.place-card');
      openModal(card.dataset.name, card.dataset.address);
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modalOkBtn.addEventListener('click', closeModal);

  detailModal.addEventListener('click', (event) => {
    if (event.target === detailModal) {
      closeModal();
    }
  });

  // Jalankan filter awal saat halaman pertama kali dimuat (sesuai Wireframe Filter Pencarian Aktif)
  applyFilters();
});
