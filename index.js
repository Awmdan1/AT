require('dotenv').config();
const { ethers } = require('ethers');

// Fungsi utama untuk transfer
async function autoTransfer(chain, privateKey, amountToSend, recipientAddresses) {
    // RPC URLs untuk beberapa jaringan blockchain
    const networks = {
        ethereum: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        bsc: "https://bsc-dataseed.binance.org/",
        polygon: "https://polygon-rpc.com/",
        odyssey: "https://odyssey.ithaca.xyz", // Contoh untuk menambahkan chain Odyssey
    };

    // Validasi apakah chain yang dipilih tersedia
    if (!networks[chain]) {
        console.error("Jaringan tidak didukung!");
        return;
    }

    // Inisialisasi provider berdasarkan chain yang dipilih
    const provider = new ethers.JsonRpcProvider(networks[chain]);

    // Membuat wallet dari private key
    const wallet = new ethers.Wallet(privateKey, provider);

    // Looping untuk mentransfer ke semua alamat secara acak
    for (let i = 0; i < recipientAddresses.length; i++) {
        try {
            let recipient = recipientAddresses[Math.floor(Math.random() * recipientAddresses.length)];

            console.log(`Mengirim ${amountToSend} ETH ke ${recipient}...`);

            const tx = await wallet.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amountToSend), // Mengonversi nilai ether
            });

            console.log(`Transaksi berhasil! Hash: ${tx.hash}`);

            // Tunggu transaksi selesai
            await tx.wait();
            console.log(`Transaksi konfirmasi selesai ke ${recipient}`);
        } catch (error) {
            console.error(`Error saat mengirim ke ${recipient}:`, error);
        }
    }
}

// Fungsi untuk mengeksekusi auto-transfer
async function main() {
    // Masukkan chain, private key, dan jumlah yang akan dikirim
    const chain = process.argv[2];
    const privateKey = process.env.PRIVATE_KEY || process.argv[3];
    const amountToSend = process.argv[4] || "0.01"; // Nilai default jika tidak disediakan

    // Alamat penerima yang akan dipilih secara acak
    const recipientAddresses = [
        "0xRecipientAddress1...",
        "0xRecipientAddress2...",
        "0xRecipientAddress3...",
        "0xRecipientAddress4..."
    ];

    // Panggil fungsi autoTransfer
    await autoTransfer(chain, privateKey, amountToSend, recipientAddresses);
}

// Jalankan bot auto-transfer
main().catch(console.error);
