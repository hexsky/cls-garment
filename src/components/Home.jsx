import { db } from '../firebase';
import { useEffect } from 'react';
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Home() {
    const bahanPerProduk = {
        kaos: [
            "Cotton Combed 20s",
            "Cotton Combed 24s",
            "Cotton Combed 30s",
            "Cotton Carded",
            "Polyester",
            "TC",
            "CVC",
            "Bamboo Cotton"
        ],
        jersey: [
            "Dry Fit",
            "Polyester",
            "Hyget",
            "Spandek",
            "Serena",
            "Lotto",
            "Paragon"
        ],
        polo: [
            "Lacoste CVC",
            "Lacoste PE",
            "Cotton Combed Piqué",
            "Lacoste Cotton",
            "TC Piqué"
        ],
        hoodie: [
            "Fleece",
            "Baby Terry",
            "CVC Fleece",
            "PE Fleece"
        ],
        sweater: [
            "Baby Terry",
            "Cotton Fleece",
            "Knitting Wool",
            "CVC Fleece"
        ],
        kemeja: [
            "American Drill",
            "Japan Drill",
            "Oxford",
            "Katun Twill",
            "Tropical",
            "Ripstop",
            "Canvas"
        ],
        workshirt: [
            "Japan Drill",
            "American Drill",
            "Ripstop",
            "Kanvas",
            "Tropical",
            "Twill"
        ]
    };

    const hargaProduk = {
        kaos: {
            "cotton-combed-20s": 62000,
            "cotton-combed-24s": 60000,
            "cotton-combed-30s": 58000,
            "cotton-carded": 55000,
            polyester: 52000,
            tc: 53000,
            cvc: 54000,
            "bamboo-cotton": 68000
        },
        jersey: {
            "dry-fit": 55000,
            polyester: 52000,
            hyget: 45000,
            spandek: 58000,
            serena: 60000,
            lotto: 62000,
            paragon: 64000
        },
        "polo": {
            "lacoste-cvc": 66000,
            "lacoste-pe": 64000,
            "cotton-combed-pique": 68000,
            "lacoste-cotton": 70000,
            "tc-pique": 65000
        },
        hoodie: {
            fleece: 85000,
            "baby-terry": 82000,
            "cvc-fleece": 88000,
            "pe-fleece": 80000
        },
        sweater: {
            "baby-terry": 75000,
            "cotton-fleece": 78000,
            "knitting-wool": 85000,
            "cvc-fleece": 77000
        },
        kemeja: {
            "american-drill": 115000,
            "japan-drill": 120000,
            oxford: 110000,
            "katun-twill": 125000,
            tropical: 108000,
            ripstop: 118000,
            canvas: 122000
        },
        workshirt: {
            "japan-drill": 120000,
            "american-drill": 115000,
            ripstop: 118000,
            kanvas: 122000,
            tropical: 108000,
            twill: 112000
        }
    };

    function getHargaSatuan(jenisProduk, jenisKain) {
        const produkKey = jenisProduk.toLowerCase().replace(/\s+/g, "-");
        const kainKey = jenisKain.toLowerCase().replace(/\s+/g, "-");
        return hargaProduk[produkKey]?.[kainKey] || 0;
    }

    useEffect(() => {
        const header = document.querySelector('header');
        let lastScrollTop = 0;

        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (window.innerWidth <= 768) { // hanya untuk mobile
                if (currentScroll > lastScrollTop && currentScroll > 100) {
                    header.classList.add('hide-navbar');
                } else {
                    header.classList.remove('hide-navbar');
                }
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        };

        window.addEventListener('scroll', handleScroll);

        const burgerBtn = document.getElementById('burgerBtn');
        const navLinks = document.getElementById('navLinks');
        const toggleBurger = () => navLinks?.classList.toggle("show");

        if (burgerBtn && navLinks) {
            burgerBtn.addEventListener("click", toggleBurger);
        }

        const handleOrderSubmit = async function (e) {
            e.preventDefault();

            const linkDesain = document.getElementById("link-desain")?.value || "";
            if (!linkDesain.startsWith("https://drive.google.com/")) {
                alert("Link desain harus dari Google Drive.");
                return;
            }

            const data = {
                nama: document.getElementById("nama")?.value,
                email: document.getElementById("email")?.value,
                telepon: document.getElementById("telepon")?.value,
                alamat: document.getElementById("alamat")?.value,
                jenisProduk: document.getElementById("jenis")?.value,
                jumlah: parseInt(document.getElementById("jumlah")?.value),
                ukuran: {
                    XXS: parseInt(document.getElementById("ukuranXXS")?.value),
                    XS: parseInt(document.getElementById("ukuranXS")?.value),
                    S: parseInt(document.getElementById("ukuranS")?.value),
                    M: parseInt(document.getElementById("ukuranM")?.value),
                    L: parseInt(document.getElementById("ukuranL")?.value),
                    XL: parseInt(document.getElementById("ukuranXL")?.value),
                    XXL: parseInt(document.getElementById("ukuranXXL")?.value),
                },
                sablon: document.querySelector('input[name="sablon"]:checked')?.value,
                warnaKain: document.getElementById("warna-kain")?.value,
                jenisKain: document.getElementById("jenis-kain")?.value,
                desainDriveLink: linkDesain,
                catatan: document.getElementById("catatan")?.value,
                deadline: document.getElementById("tanggal-deadline")?.value,
                pengiriman: document.getElementById("metode-pengiriman")?.value,
                pembayaran: document.getElementById("metode-pembayaran")?.value,
                waktu: Timestamp.now()
            };

            const totalUkuran =
                parseInt(document.getElementById("ukuranXXS")?.value) +
                parseInt(document.getElementById("ukuranXS")?.value) +
                parseInt(document.getElementById("ukuranS")?.value) +
                parseInt(document.getElementById("ukuranM")?.value) +
                parseInt(document.getElementById("ukuranL")?.value) +
                parseInt(document.getElementById("ukuranXL")?.value) +
                parseInt(document.getElementById("ukuranXXL")?.value);

            const totalJumlah = parseInt(document.getElementById("jumlah")?.value);

            if (totalUkuran !== totalJumlah) {
                alert(`Total jumlah per ukuran (${totalUkuran}) harus sama dengan jumlah pesanan (${totalJumlah})`);
                return;
            }


            try {
                await addDoc(collection(db, "pemesanan"), data);

                const hargaSatuan = getHargaSatuan(data.jenisProduk, data.jenisKain);
                const total = hargaSatuan * totalJumlah

                const form = document.getElementById("orderForm");
                const thankYou = document.getElementById("thankYouScreen");
                const thankYouText = document.getElementById("thankYouText");

                if (form && thankYou) {
                    form.style.display = "none";
                    thankYou.style.display = "block";

                    if (thankYouText) {
                        thankYouText.innerHTML = `
                            Terima kasih telah melakukan pemesanan.<br><br>
                            Silakan transfer sejumlah <strong>Rp${total.toLocaleString("id-ID")}</strong><br>
                            ke rekening BCA <strong>0152865617</strong> a.n. CLS Garment.`;
                    }
                }
            } catch (error) {
                console.error("Gagal simpan pesanan:", error.message);
                alert("Gagal mengirim pesanan. Coba lagi nanti." + error.message);
            }
        };

        const hitungBtn = document.getElementById("hitungHargaBtn");
        const hasilHarga = document.getElementById("hasilHarga");

        if (hitungBtn && hasilHarga) {
            hitungBtn.addEventListener("click", () => {
                const jenis = document.getElementById("jenis")?.value;
                const kain = document.getElementById("jenis-kain")?.value;
                const jumlah = parseInt(document.getElementById("jumlah")?.value) || 0;

                const hargaSatuan = getHargaSatuan(jenis, kain);
                const total = hargaSatuan * jumlah;

                if (!jenis || !kain || !jumlah) {
                    hasilHarga.textContent = "Lengkapi pilihan produk, kain, dan jumlah.";
                    return;
                }

                if (hargaSatuan === 0) {
                    hasilHarga.textContent = "Kombinasi produk dan kain tidak tersedia.";
                    return;
                }

                hasilHarga.innerHTML = `
            Harga satuan: Rp${hargaSatuan.toLocaleString("id-ID")}<br>
            Total harga: Rp${total.toLocaleString("id-ID")}
        `;
            });
        }


        const orderForm = document.getElementById("orderForm");
        if (orderForm) {
            orderForm.addEventListener("submit", handleOrderSubmit);
        }

        const jenisSelect = document.getElementById("jenis");
        const bahanSelect = document.getElementById("jenis-kain");

        function updateDropdownBahan() {
            const jenis = jenisSelect.value;
            const bahanList = bahanPerProduk[jenis] || [];

            bahanSelect.innerHTML = '<option value="">Pilih Jenis Kain</option>';
            bahanList.forEach((bahan) => {
                const opt = document.createElement("option");
                opt.value = bahan.toLowerCase().replace(/\s+/g, "-");
                opt.textContent = bahan;
                bahanSelect.appendChild(opt);
            });
        }

        if (jenisSelect && bahanSelect) {
            jenisSelect.addEventListener("change", updateDropdownBahan);

            updateDropdownBahan();
        }


        if (jenisSelect && bahanSelect) {
            jenisSelect.addEventListener("change", updateDropdownBahan);
            updateDropdownBahan();
        }

        const contactForm = document.getElementById('contactForm');
        const handleContactSubmit = (e) => {
            e.preventDefault();
            alert("Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.");
        };
        if (contactForm) {
            contactForm.addEventListener("submit", handleContactSubmit);
        }

        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                    });
                }
            });
        });

        const backBtn = document.getElementById("backToForm");
        if (backBtn) {
            backBtn.addEventListener("click", function () {
                const form = document.getElementById("orderForm");
                const thankYou = document.getElementById("thankYouScreen");
                if (form && thankYou) {
                    form.style.display = "block";
                    thankYou.style.display = "none";
                    form.reset();
                    window.scrollTo({ top: form.offsetTop - 80, behavior: "smooth" });
                }
            });
        }


        // Cleanup event listener saat unmount
        return () => {
            if (orderForm) orderForm.removeEventListener("submit", handleOrderSubmit);
            if (contactForm) contactForm.removeEventListener("submit", handleContactSubmit);
            if (burgerBtn) burgerBtn.removeEventListener("click", toggleBurger);
            if (hitungBtn) hitungBtn.removeEventListener("click", () => { });
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <header>
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">CLS <span>Garment</span></div>
                        <button className="burger" id="burgerBtn" aria-label="Toggle menu">☰</button>
                        <ul className="nav-links" id="navLinks">
                            <li><a href="#beranda">Beranda</a></li>
                            <li><a href="#tentang">Tentang Kami</a></li>
                            <li><a href="#layanan">Layanan</a></li>
                            <li><a href="#proses">Proses</a></li>
                            <li><a href="#galeri">Galeri</a></li>
                            <li><a href="#pemesanan">Pemesanan</a></li>
                            <li><a href="#kontak">Kontak</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <section className="hero" id="beranda">
                <div className="container">
                    <h1>Jasa Konveksi Pakaian Premium</h1>
                    <p>CLS Garment menyediakan layanan konveksi pakaian berkualitas tinggi dengan harga bersaing. Kami fokus pada kualitas produk dan kepuasan pelanggan.</p>
                    <a href="#pemesanan" className="btn">Pesan Sekarang</a>
                    <a href="#kontak" className="btn btn-outline">Hubungi Kami</a>
                </div>
            </section>

            <section className="section" id="layanan">
                <div className="container">
                    <div className="section-title">
                        <h2>Layanan Kami</h2>
                        <p>Kami menyediakan berbagai layanan konveksi pakaian untuk memenuhi kebutuhan personal dan bisnis Anda</p>
                    </div>
                    <div className="services">
                        <div className="service-card">
                            <div className="service-icon">✓</div>
                            <h3 className="service-title">T-shirt</h3>
                            <p>Kategori kaos kami menawarkan solusi pakaian yang fleksibel dan dapat disesuaikan untuk berbagai kebutuhan. Mulai dari promosi, event, merchandise komunitas, hingga casual harian, semua bisa diproduksi secara custom. Tersedia berbagai model seperti kaos oblong (crew neck), kaos raglan, dan kaos polo yang cocok untuk pria maupun wanita.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">✓</div>
                            <h3 className="service-title">Shirt</h3>
                            <p>CLS Garment melayani pembuatan kemeja custom yang cocok digunakan sebagai seragam kantor, seragam komunitas, acara resmi, hingga kemeja santai untuk kegiatan outdoor atau casual event. Kemeja dapat dikustomisasi dari segi model (lengan panjang/pendek, slim fit/reguler), pilihan warna, serta tambahan identitas brand seperti bordir logo atau nama.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">✓</div>
                            <h3 className="service-title">Uniform</h3>
                            <p>Kategori ini mencakup kebutuhan seragam untuk berbagai sektor—baik pendidikan, perusahaan, instansi pemerintah, maupun komunitas. CLS Garment melayani pembuatan seragam sekolah, seragam kerja kantoran, hingga seragam institusi dengan desain dan warna yang dapat disesuaikan. Setiap pesanan dapat dimodifikasi sesuai kebutuhan seperti cutting, logo, dan penamaan.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">✓</div>
                            <h3 className="service-title">Work Shirt</h3>
                            <p>Cocok untuk pekerja industri, proyek konstruksi, teknisi, hingga seragam operator lapangan. Model pakaian bisa disesuaikan—mulai dari kemeja lengan panjang, wearpack, hingga jaket kerja—semuanya didesain untuk kenyamanan dan fungsionalitas yang maksimal. Pakaian kerja dari CLS Garment dibuat dengan potongan ergonomis dan ketahanan material tinggi.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="tentang">
                <div className="container">
                    <div className="about-content">
                        <div className="about-img">
                            <img src="assets/image/cls_about_us.jpg" alt="About CLS Garment" />
                        </div>
                        <div className="about-text">
                            <h3>Tentang CLS Garment</h3>
                            <p>CLS (Cahaya Langgeng Sentosa) GARMENT adalah usaha konveksi yang berdiri sejak tahun 2005, melayani pembuatan berbagai jenis pakaian seperti kaos, kemeja, seragam, dan workshirt, serta jasa sablon.</p>
                            <p>Dengan pengalaman lebih dari satu dekade, CLS GARMENT menerima pesanan dalam jumlah kecil mulai dari 2 lusin hingga ribuan, menyesuaikan bahan dan desain sesuai kebutuhan pelanggan.</p>
                            <p>Didukung oleh tim berpengalaman, CLS GARMENT berkomitmen untuk memberikan hasil berkualitas dengan harga kompetitif, menjadikan CLS GARMENT pilihan tepat untuk kebutuhan konveksi Anda.</p>
                            <a href="#kontak" className="btn">Hubungi Kami</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="proses" style={{ backgroundColor: 'var(--light)' }}>
                <div className="container">
                    <div className="section-title">
                        <h2>Proses Pengerjaan</h2>
                        <p>Berikut adalah tahapan proses produksi di CLS Garment</p>
                    </div>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h3>Konsultasi</h3>
                            <p>Diskusi kebutuhan dan detail produk yang diinginkan, termasuk bahan, desain, dan jumlah</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h3>Desain</h3>
                            <p>Proses desain grafis dan finalisasi template yang akan digunakan dalam produksi</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h3>Produksi</h3>
                            <p>Tahapan pemotongan bahan, proses sablon atau bordir, dan proses jahit</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h3>Quality Control</h3>
                            <p>Pemeriksaan kualitas untuk memastikan setiap produk memenuhi standar kami</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">5</div>
                            <h3>Pengiriman</h3>
                            <p>Pengemasan dan pengiriman produk ke alamat pelanggan</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="galeri">
                <div className="container">
                    <div className="section-title">
                        <h2>Galeri Produk</h2>
                        <p>Beberapa contoh hasil produksi kami</p>
                    </div>
                    <div className="gallery">
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_tshirt1.jpg" alt="Kaos 1" />
                            <div className="gallery-overlay">Kaos Custom</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_tshirt2.jpg" alt="Kaos 2" />
                            <div className="gallery-overlay">Polo Custom</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_shirt1.jpg" alt="Kemeja 1" />
                            <div className="gallery-overlay">Kemeja Custom</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_shirt2.jpg" alt="Kemeja 2" />
                            <div className="gallery-overlay">Kemeja Custom</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_uniform1.jpg" alt="Seragam 1" />
                            <div className="gallery-overlay">Seragam</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_uniform2.jpg" alt="Seragam 2" />
                            <div className="gallery-overlay">Seragam</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_workshirt1.jpg" alt="Workshirt 1" />
                            <div className="gallery-overlay">Work Shirt</div>
                        </div>
                        <div className="gallery-item">
                            <img src="assets/image/cls_product_workshirt2.jpg" alt="Workshirt 2" />
                            <div className="gallery-overlay">Work Shirt</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>Testimoni Pelanggan</h2>
                        <p>Apa kata mereka tentang jasa konveksi kami</p>
                    </div>
                    <div className="testimonials">
                        <div className="testimonial-card">
                            <div className="testimonial-text">
                                "Kami dari KUTA LINES telah bekerja sama dengan CLS Garment selama lebih dari 15 tahun. Kami sangat puas dengan kualitas jahitannya yang selalu bagus dan packing yang rapi. Harapan kami, kualitas ini bisa terus dipertahankan. Terima kasih, CLS!"
                            </div>
                            <div className="testimonial-author">
                                <div className="author-img">
                                    <img src="/assets/image/icon_kutalines.jpg" alt="Kuta Lines" />
                                </div>
                                <div className="author-info">
                                    <h4>Kuta Lines</h4>
                                    <p>Bali Apparel Brand</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-text">
                                "Kami sangat puas dengan hasil sablon dari CLS Garment, baik itu DTF maupun glow in the dark, semuanya sangat bagus. Jahitannya pun rapi dan pengerjaannya selalu tepat waktu. Terima kasih atas layanan terbaiknya!"
                            </div>
                            <div className="testimonial-author">
                                <div className="author-img">
                                    <img src="/assets/image/icon_aswaru.webp" alt="Aswaru" />
                                </div>
                                <div className="author-info">
                                    <h4>Aswaru Communication</h4>
                                    <p>Graphic Design Company</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-text">
                                "Sudah 12 tahun kami bekerja sama dengan CLS Garment, dan puluhan ribu seragam pabrik serta proyek telah kami produksi bersama. Kami selalu puas dengan jahitan yang rapi, pengiriman yang tepat waktu, dan packing yang tertata rapi. Semoga CLS semakin sukses dan terus menjadi mitra andalan kami."
                            </div>
                            <div className="testimonial-author">
                                <div className="author-img">
                                    <img src="/assets/image/icon_bosspanel.jpg" alt="Bosspanel" />
                                </div>
                                <div className="author-info">
                                    <h4>Bosspanel Jakarta</h4>
                                    <p>Housing & Building Contractor Manufacture Company</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section order-section" id="pemesanan">
                <div className="container">
                    <div className="section-title">
                        <h2>Formulir Pemesanan</h2>
                        <p>Isi formulir di bawah ini untuk melakukan pemesanan</p>
                    </div>
                    <div className="order-form">
                        <form id="orderForm">
                            <div className="form-section">
                                <h3 className="form-section-title">Informasi Pribadi</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="nama">Nama Lengkap</label>
                                        <input type="text" className="form-control" id="nama" autocomplete="name" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" autocomplete="email" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="telepon">Nomor Telepon</label>
                                        <input type="tel" className="form-control" id="telepon" autocomplete="tel" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="alamat">Alamat</label>
                                        <input type="text" className="form-control" id="alamat" autocomplete="street-address" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="form-section-title">Detail Pesanan</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="jenis">Jenis Produk</label>
                                        <select className="form-control" id="jenis" required>
                                            <option value="">Pilih Jenis Produk</option>
                                            <option value="kaos">Kaos</option>
                                            <option value="jersey">Jersey</option>
                                            <option value="polo">Polo Shirt</option>
                                            <option value="hoodie">Hoodie</option>
                                            <option value="sweater">Sweater</option>
                                            <option value="kemeja">Kemeja</option>
                                            <option value="workshirt">Workshirt</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="jumlah">Jumlah</label>
                                        <input type="number" className="form-control" id="jumlah" min="24" required />
                                        <small>Minimal order 24 pcs</small>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <p className="form-subtitle">Size Chart</p>
                                    <div className="size-chart">
                                        <table className="size-chart-table">
                                            <thead>
                                                <tr>
                                                    <th>Size</th>
                                                    <th>Lebar Dada (cm)</th>
                                                    <th>Panjang Badan (cm)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>XXS</td>
                                                    <td>42</td>
                                                    <td>60</td>
                                                </tr>
                                                <tr>
                                                    <td>XS</td>
                                                    <td>45</td>
                                                    <td>63</td>
                                                </tr>
                                                <tr>
                                                    <td>S</td>
                                                    <td>48</td>
                                                    <td>66</td>
                                                </tr>
                                                <tr>
                                                    <td>M</td>
                                                    <td>51</td>
                                                    <td>69</td>
                                                </tr>
                                                <tr>
                                                    <td>L</td>
                                                    <td>54</td>
                                                    <td>72</td>
                                                </tr>
                                                <tr>
                                                    <td>XL</td>
                                                    <td>57</td>
                                                    <td>75</td>
                                                </tr>
                                                <tr>
                                                    <td>XXL</td>
                                                    <td>59</td>
                                                    <td>78</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <small className="size-note">*Toleransi ukuran 1-1.5 cm</small>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <p className="form-subtitle">Ukuran (Jumlah per ukuran)</p>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="ukuranXXS">XXS</label>
                                            <input type="number" className="form-control" id="ukuranXXS" defaultValue="0" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="ukuranXS">XS</label>
                                            <input type="number" className="form-control" id="ukuranXS" defaultValue="0" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="ukuranS">S</label>
                                            <input type="number" className="form-control" id="ukuranS" defaultValue="0" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="ukuranM">M</label>
                                            <input type="number" className="form-control" id="ukuranM" defaultValue="0" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="ukuranL">L</label>
                                            <input type="number" className="form-control" id="ukuranL" defaultValue="0" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="ukuranXL">XL</label>
                                            <input type="number" className="form-control" id="ukuranXL" defaultValue="0" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="ukuranXXL">XXL</label>
                                            <input type="number" className="form-control" id="ukuranXXL" defaultValue="0" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="form-section-title">Metode Produksi</h3>
                                <div className="form-group">
                                    <p className="form-subtitle">Jenis Sablon / Bordir</p>
                                    <div className="checkbox-group">
                                        <div className="checkbox-item">
                                            <input type="radio" id="sablon-plastisol" name="sablon" value="plastisol" />
                                            <label htmlFor="sablon-plastisol">Sablon Plastisol</label>
                                        </div>
                                        <div className="checkbox-item">
                                            <input type="radio" id="sablon-rubber" name="sablon" value="rubber" />
                                            <label htmlFor="sablon-rubber">Sablon Rubber</label>
                                        </div>
                                        <div className="checkbox-item">
                                            <input type="radio" id="sablon-discharge" name="sablon" value="discharge" />
                                            <label htmlFor="sablon-discharge">Sablon Discharge</label>
                                        </div>
                                        <div className="checkbox-item">
                                            <input type="radio" id="bordir" name="sablon" value="bordir" />
                                            <label htmlFor="bordir">Bordir</label>
                                        </div>
                                        <div className="checkbox-item">
                                            <input type="radio" id="dtf" name="sablon" value="dtf" />
                                            <label htmlFor="dtf">DTF (Direct to Film)</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="warna-kain">Warna Kain</label>
                                    <textarea className="form-control" id="warna-kain" rows="1"></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="jenis-kain">Jenis Kain</label>
                                    <select className="form-control" id="jenis-kain">
                                        <option value="">Pilih Jenis Kain</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="link-desain">Link Google Drive Desain</label>
                                    <input type="url" className="form-control" id="link-desain" placeholder="https://drive.google.com/..." />
                                    <small>Pastikan link bisa diakses publik</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="catatan">Catatan Tambahan</label>
                                    <textarea className="form-control" id="catatan" rows="4"></textarea>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="form-section-title">Pengiriman & Pembayaran</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="tanggal-deadline">Tanggal Deadline</label>
                                        <input type="date" className="form-control" id="tanggal-deadline" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="metode-pengiriman">Metode Pengiriman</label>
                                        <select className="form-control" id="metode-pengiriman">
                                            <option value="">Pilih Metode Pengiriman</option>
                                            <option value="jne">JNE</option>
                                            <option value="jnt">J&T</option>
                                            <option value="sicepat">SiCepat</option>
                                            <option value="pos">POS Indonesia</option>
                                            <option value="gojek">GoSend</option>
                                            <option value="grab">GrabExpress</option>
                                            <option value="ambil">Ambil Sendiri</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="metode-pembayaran">Metode Pembayaran</label>
                                    <select className="form-control" id="metode-pembayaran">
                                        <option value="">Pilih Metode Pembayaran</option>
                                        <option value="transfer-bca">Transfer Bank BCA</option>
                                        <option value="transfer-mandiri">Transfer Bank Mandiri</option>
                                        <option value="transfer-bni">Transfer Bank BNI</option>
                                        <option value="transfer-bri">Transfer Bank BRI</option>
                                        <option value="qris">QRIS</option>
                                        <option value="gopay">GoPay</option>
                                        <option value="ovo">OVO</option>
                                        <option value="dana">DANA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                                <button type="button" id="hitungHargaBtn" className="btn btn-outline">Hitung Total Harga</button>
                                <div id="hasilHarga" style={{ fontWeight: "bold", marginLeft: "auto" }}></div>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn">Kirim Pesanan</button>
                            </div>
                        </form>
                        <div id="thankYouScreen" style={{ display: "none", textAlign: "center", padding: "60px 20px" }}>
                            <p id="thankYouText">Silakan kirim bukti pembayaran ke WhatsApp kami.</p>
                            <a
                                href="https://wa.me/628112649878?text=Halo%20saya%20baru%20melakukan%20pemesanan%20di%20CLS%20Garment"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Kirim Bukti via WhatsApp
                            </a>
                            <br /><br />
                            <button className="btn btn-outline" id="backToForm">Kembali ke Beranda</button>
                        </div>

                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-column">
                            <h3>CLS Garment</h3>
                            <p>Jasa konveksi premium dengan kualitas terbaik dan harga bersaing. Melayani pembuatan kaos, kemeja, seragam, workshirt, dan berbagai produk custom lainnya.</p>
                        </div>
                        <div className="footer-column">
                            <h3>Layanan Kami</h3>
                            <ul className="footer-links">
                                <li><a href="#layanan">T-shirt</a></li>
                                <li><a href="#layanan">Shirt</a></li>
                                <li><a href="#layanan">Uniform</a></li>
                                <li><a href="#layanan">Work Shirt</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Link Cepat</h3>
                            <ul className="footer-links">
                                <li><a href="#beranda">Beranda</a></li>
                                <li><a href="#tentang">Tentang Kami</a></li>
                                <li><a href="#layanan">Layanan</a></li>
                                <li><a href="#proses">Proses</a></li>
                                <li><a href="#galeri">Galeri</a></li>
                                <li><a href="#pemesanan">Pemesanan</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Kontak</h3>
                            <ul className="footer-links" id="kontak">
                                <li>📍 Nanasan RT 05 RW 03, Colomadu, Karanganyar, Surakarta</li>
                                <li>📱 +62 811 2649 878</li>
                                <li>✉️ starclssolo@gmail.com</li>
                                <li>🕒 Senin - Sabtu: 08.00 - 16.00</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 CLS Garment. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}