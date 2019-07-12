import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	
	mode = "sign in";
	username;
	password;
	user;

	constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
	}
	
	ngOnInit() {
		
		var self=this;
		
		this.afAuth.auth.onAuthStateChanged(function(user) {
		  if (user) {
			
			self.user=user;
			
		  } else {
			// No user is signed in.
		  }
		});

	}
	
	login() {
		this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
	}
	
	logout() {
		this.afAuth.auth.signOut();
	}
	
	changeMode() {
		if(this.mode == "sign in"){
			this.mode = "sign up";
		}else{
			this.mode = "sign in";
		}
	}
	
	signInOrUp() {
		var self = this
		
		if(this.mode=="sign up"){
			
			this.afAuth.auth.createUserWithEmailAndPassword(this.username, this.password)
			.then(function(res){
				self.afs.collection('users').doc(res.user.email).set({
					email: res.user.email
				})
				.then(function(){
						self.router.navigate(['/main']);
					}
				)
			})
			.catch(function(error) {
				alert(error.message);
			});
			
		}else{
			
			this.afAuth.auth.signInWithEmailAndPassword(this.username, this.password)
			.then(function(res){
				self.router.navigate(['/main']);
			})
			.catch(function(error) {
				alert(error.message);
			});
		}
		
		
	}
	
	signOut() {
		this.afAuth.auth.signOut().then(function() {
		  alert("signed out");
		}).catch(function(error) {
		  alert(error.message);
		});
	}

}
