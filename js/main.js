//check option box editCostume size gender
//profile/logout
//register

var serviceHost = 'http://xewadbsrv.000webhostapp.com'
window.fn = {};

window.fn.load = function(page, id) {
	var content = document.getElementById('myNavigator');
	content.pushPage(page)
	.then(function() {
		if (page == 'detailCostume.html') {
			getCostume(id);
		} else if (page == 'detailTransaction.html') {
			getTransaction(id);
		} else if (page == 'landing.html') {
			getCostume();
			document.querySelector('ons-tabbar').addEventListener('prechange', function() {
				if (document.querySelector('ons-tabbar').getActiveTabIndex() == 0) {
					getTransaction();
					getHistory();
					getProfile(loginAs);
				}
			});
		} else if (page == 'editCostume.html') {
			editCostume(id);
		};
	});
};

if (window.openDatabase) {
	var mydb = openDatabase("dbxewa", "0.1", "XEWA local Database", 1024 * 1024);

	mydb.transaction(function (t) {
		t.executeSql("CREATE TABLE IF NOT EXISTS customerloggedin (username VARCHAR(15) UNIQUE, isLoggedIn VARCHAR(5))");
		t.executeSql("SELECT COUNT(*) AS count FROM customerloggedin", [], function (transaction, results) {
			if (results.rows.item(0).count == '0') {
				t.executeSql("INSERT INTO customerloggedin VALUES ('default', 'false')");
			}
		});
	});
} else {
	alert("WebSQL tidak didukung oleh browser ini");
}

var loginAs = "";

function verify() {
	username = $("#username").val();
	password = $("#password").val();

	var url = `${serviceHost}/verify_login_customer.php?username=${username}&password=${password}`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			if (res.login_result[0].isSuccess == "true") {
				if (mydb) {
					mydb.transaction(function (t) {
						t.executeSql(`UPDATE customerloggedin set username='${username}', isLoggedIn='true' WHERE username='default'`);
					});
				} else {
					alert("Database tidak ditemukan, browser tidak mendukung WebSQL");
				}

				loginAs = username;

				fn.load('landing.html');
			} else {
				ons.notification.alert("Login gagal");
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}

function isLoggedIn() {
	if (mydb) {
		mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM customerloggedin LIMIT 1", [], function (transaction, results) {
				if (results.rows.item(0).isLoggedIn == 'true') {
					loginAs = results.rows.item(0).username;
					fn.load('landing.html');
				} else {
					fn.load('login.html');
				}
			});
		});
	} else {
		alert("Database tidak ditemukan, browser tidak mendukung WebSQL");
	}
}

ons.ready(function() {
	isLoggedIn();
});

function getCostume(id) {
	if (typeof id === "undefined") {
		var url = `${serviceHost}/get_costume.php`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var costume = res.product;
				for (var i = 0; i < costume.length; i++) {
					if (costume[i].gender == "F") {
						printGender = "<ons-icon icon='md-female'></ons-icon> Perempuan";
					} else {
						printGender = "<ons-icon icon='md-male-alt'></ons-icon> Laki-laki";
					}
					print += `
							<ons-card>
								<div class="title">
									${costume[i].name}
								</div>
								<ons-row>
									<ons-col width='150px'>
										<div class='cover' style='background-image: url("${costume[i].image_link}");'></div>
									</ons-col>
									<ons-col style='padding-left: 5px;' class='resultSection'>
										<div class='stock'>Stok: ${costume[i].available} dari ${costume[i].stock}</div>
										<div class='gender'>
											${printGender}
										</div>
										<div class='size'>Size: ${costume[i].size}</div>
										<div class='price'>Rp${costume[i].price}</div>
										<div class='rating'>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
										</div>
										<div><a href='#' onclick='fn.load("detailCostume.html", ${costume[i].id});'>Selengkapnya &rarr;</a></div>
									</ons-col>
								</ons-row>
							</ons-card>
					`;
				}
				document.getElementById('costumeHolder').innerHTML = print;
			},
			error: function (err) {
				console.log(err);
			}
		});

		setTimeout(function(){
			document.getElementById("costumeLoader").style.display = "none";
		}, 2000);
	} else {
		var url = `${serviceHost}/get_costume.php?id=${id}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var costume = res.product;
				
				if (costume[0].gender == "F") {
					printGender = "<ons-icon icon='md-female'></ons-icon> Perempuan";
				} else {
					printGender = "<ons-icon icon='md-male-alt'></ons-icon> Laki-laki";
				}

				print += `
						<ons-card>
							<div class="title">
								${costume[0].name}
							</div>
							<ons-row>
								<ons-col width='150px'>
									<div class='cover' style='background-image: url("${costume[0].image_link}");'></div>
								</ons-col>
								<ons-col style='padding-left: 5px;' class='resultSection'>
									<div class='stock'>Stok: ${costume[0].available} dari ${costume[0].stock}</div>
									<div class='gender'>
										${printGender}
									</div>
									<div class='size'>Size: ${costume[0].size}</div>
									<div class='price'>Rp${costume[0].price}</div>
									<div class='rating'>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
									</div>
								</ons-col>
							</ons-row>
							<ons-row>
								<ons-col>
									<div class='description'>${costume[0].description}</div>
								</ons-col>
							</ons-row>
							<ons-row>
								<ons-col>
									<br>
									<ons-button id="addOrder" modifier="large" onclick="addOrder(${costume[0].id})">Pesan Sekarang</ons-button>
								</ons-col>
							</ons-row>
						</ons-card>
				`;
				document.getElementById("detailCostumeHolder").innerHTML = print;
				document.getElementById("detailCostumeLoader").style.display = "none";
			},

			error: function (err) {
				console.log(err);
			}
		});
	}
}


function getTransaction(id) {
	if (typeof id === "undefined") {
		var url = `${serviceHost}/get_customer_transaction.php?from_customer=${loginAs}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var transaction = res.transaction;

				for (var i = 0; i < transaction.length; i++) {
					var trackNo = "";
					var returnTrackNo = "";

					if (transaction[i].status == 'Sedang Dikirim') {
						trackNo = `<div class='trackNo'>No resi : <b>${transaction[i].track_no}</b></div>`;
					} else if (transaction[i].status == 'Telah Diterima') {
						trackNo = `<div class='trackNo'>No resi : <b>${transaction[i].track_no}</b></div>`;
					} else if (transaction[i].status == 'Sedang Dikembalikan') {
						trackNo = `<div class='trackNo'>No resi : <b>${transaction[i].track_no}</b></div>`;
						returnTrackNo = `<div class='returnTrackNo'>No resi pengembalian : <b>${transaction[i].returned_track_no}</b></div>`;
					}

					print += `
							<ons-card>
								<div class="title">
									${transaction[i].trans_id}
								</div>
								<ons-row>
									<ons-col style='padding-left: 5px;' class='resultSection'>
										<div class='fromUsername'>${transaction[i].from_customer}</div>
										<div class='date'>${transaction[i].date_created}</div>
										<div class='status'>Status : <span class="notification notification--material">${transaction[i].status}</span></div>
										${trackNo}
										${returnTrackNo}
										<div><a href='#'onclick='fn.load("detailTransaction.html"); getTransaction(${transaction[i].trans_id});'>Selengkapnya &rarr;</a></div>
									</ons-col>
								</ons-row>
							</ons-card>
					`;
				}
				document.getElementById('transactionHolder').innerHTML = print;
			},
			error: function (err) {
				console.log(err);
			}
		});

		document.getElementById("transactionLoader").style.display = "none";
	} else {
		var url = `${serviceHost}/get_transaction.php?id=${id}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var printButton = "";
				var trackNo = ""
				var returnTrackNo = ""
				var transaction = res.transaction;

				if (transaction[0].status == 'Sedang Dikirim') {
					trackNo = `<div class='trackNo'>No resi : <b>${transaction[0].track_no}</b></div>`;
					printButton = `<ons-button id="updateTransactionSent" modifier="large" onclick="editTransactionStatus(${transaction[0].trans_id}, '${transaction[0].status}');"><ons-icon icon='md-check-circle'></ons-icon> Terima Barang</ons-button>`;
				} else if (transaction[0].status == 'Telah Diterima') {
					trackNo = `<div class='trackNo'>No resi : <b>${transaction[0].track_no}</b></div>`;
					printButton = `<ons-button id="updateTransactionReturn" modifier="large" onclick="editTransactionStatus(${transaction[0].trans_id}, '${transaction[0].status}');"><ons-icon icon='md-truck'></ons-icon> Kembalikan Barang</ons-button>`;
				} else if (transaction[0].status == 'Sedang Dikembalikan') {
					trackNo = `<div class='trackNo'>No resi : <b>${transaction[0].track_no}</b></div>`;
					returnTrackNo = `<div class='returnTrackNo'>No resi pengembalian : <b>${transaction[0].returned_track_no}</b></div>`;
				}

				print += `
						<ons-card>
							<div class="title">
									${transaction[0].trans_id}
								</div>
								<ons-row>
									<ons-col style='padding-left: 5px;' class='resultSection'>
										<div class='fromUsername'>${transaction[0].from_customer}</div>
										<div class='date'>${transaction[0].date_created}</div>
										<div class='status'>Status : <span class="notification notification--material">${transaction[0].status}</span></div>
										${trackNo}
										${returnTrackNo}
										<div class='total'>Total bayar : ${transaction[0].total_price}</div>
									</ons-col>
								</ons-row>
								<ons-row>
									<ons-col>
										${printButton}
									</ons-col>
								</ons-row>
						</ons-card>
				`;
				document.getElementById("detailTransactionHolder").innerHTML = print;
				document.getElementById("detailTransactionLoader").style.display = "none";
			},

			error: function (err) {
				console.log(err);
			}
		});
	}
}


function getHistory(id) {
	if (typeof id === "undefined") {
		var url = `${serviceHost}/get_customer_history.php?from_customer=${loginAs}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";

				if (res.message !== "transaction empty") {
					var history = res.transaction;
					for (var i = 0; i < history.length; i++) {
						print += `
								<tr>
									<td class="text-left">${history[i].trans_id}</td>
									<td class="text-left">${history[i].from_customer}</td>
									<td class="text-left">${history[i].date_created}</td>
									<td class="text-left">${history[i].total_price}</td>
								</tr>
						`;
					}
					document.getElementById('historyHolder').innerHTML = print;
				}
			},
			error: function (err) {
				console.log(err);
			}
		});

		document.getElementById("historyLoader").style.display = "none";
	} else {
		alert("IDNYA " + id);
	}
}

function editTransactionStatus(id, status) {
	if (status == 'Sedang Dikirim') {
		ons.notification.confirm({
			message: 'Apakah anda yakin telah menerima barang ini?',
			buttonLabels: ['Batal', 'Ya'],
			cancelable: true,
			callback: function (index) {
				if (index == 1) {
					updateTransactionStatus(id, 'Telah Diterima');
				}
			}
		});
	} else if (status == 'Telah Diterima') {
		ons.notification.prompt({
			message: `Masukkan nomor resi produk:`,
			cancelable: true,
			callback: function (input) {
				if (input !== null) {
					updateTransactionStatus(id, 'Sedang Dikembalikan', input);
				}
			}
		});
	}
}

function updateTransactionStatus(id, status, track_no) {
	var url = `${serviceHost}/update_transaction_status.php?id=${id}&status=${status}&returned_track_no=${track_no}`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			var print = "";
			if (res.query_result[0].isSuccess == "true") {
				ons.notification.toast('Status transaksi berhasil diperbarui!', { timeout: 2000 });
				setTimeout(function(){
					getTransaction(id);
				}, 2000);
			} else {
				ons.notification.alert("Data gagal diperbarui!");
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}

function addOrder(id) {
	ons.notification.confirm({
		message: 'Apakah anda yakin akan menyewa produk ini?',
		buttonLabels: ['Batal', 'Ya'],
		cancelable: true,
		callback: function (index) {
			if (index == 1) {
				var url = `${serviceHost}/add_transaction.php?from_customer=${loginAs}&product_id=${id}`;
				$.ajax({
					url: url,
					method: 'GET',
					dataType: 'JSON',
					success: function (res) {
						var print = "";
						if (res.query_result[0].isSuccess == "true") {
							ons.notification.toast('Produk berhasil dipesan!', { timeout: 2000 });
							setTimeout(function(){
								document.getElementById('myNavigator').popPage();
								getCostume();
							}, 2000);
						} else {
							ons.notification.alert("Produk gagal dipesan!");
						}
					},
					error: function (err) {
						console.log(err);
					}
				});
			}
		}
	});
}

function addCustomer() {
	newCustomerFullname = $("#registerFullname").val();
	newCustomerUsername = $("#registerUsername").val();
	newCustomerPassword = $("#registerPassword").val();
	newCustomerEmail = $("#registerEmail").val();
	newCustomerPhone = $("#registerPhone").val();
	newCustomerAddress = $("#registerAddress").val();

	if (newCustomerFullname !== '' && newCustomerUsername !== '' && newCustomerPassword !== '' && newCustomerEmail !== '' && newCustomerPhone !== '' && newCustomerAddress !=='') {
		var modal = document.getElementById('loaderOverlay');
		modal.show();

		var url = `${serviceHost}/add_customer.php?fullname=${newCustomerFullname}&username=${newCustomerUsername}&password=${newCustomerPassword}&email=${newCustomerEmail}&phone=${newCustomerPhone}&address=${newCustomerAddress}`;
		console.log(url);
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				if (res.query_result[0].isSuccess == "true") {
					setTimeout(function(){
						modal.hide();
						document.getElementById('myNavigator').popPage();
						ons.notification.toast('Berhasil terdaftar!', { timeout: 2000 });
					}, 2000);
				} else {
					ons.notification.alert("Data gagal tersimpan!");
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	} else {
		ons.notification.alert("Lengkapi semua input!");
	}
}

function getProfile(username) {
	var url = `${serviceHost}/get_profile.php?username=${username}&type=customer`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			var print = "";
			var profile = res.profile;

			print += `
					<ons-card>
						<div class="title">
								${profile[0].username}
							</div>
							<ons-row>
								<ons-col style='padding-left: 5px;' class='resultSection'>
									<div>Username :</div>
									<div>Email :</div>
									<div>Phone :</div>
									<div>Address :</div>
								</ons-col>
								<ons-col style='padding-left: 5px;' class='resultSection'>
									<div class='profileUsername'>${profile[0].username}</div>
									<div class='profileEmail'>${profile[0].email}</div>
									<div class='profilePhone'>${profile[0].phone}</div>
									<div class='profileAddress'>${profile[0].address}</div>
								</ons-col>
							</ons-row>
							<ons-row>
								<ons-col>
									<ons-button modifier="large" onclick="logout()">Sign Out</ons-button>
								</ons-col>
							</ons-row>
					</ons-card>
			`;
			document.getElementById("profileHolder").innerHTML = print;
			document.getElementById("profileLoader").style.display = "none";
		},

		error: function (err) {
			console.log(err);
		}
	});
}

function logout() {
	mydb.transaction(function (t) {
		t.executeSql(`DELETE FROM customerloggedin WHERE username='${loginAs}'`);
	});

	document.getElementById('myNavigator').resetToPage('login.html');
}