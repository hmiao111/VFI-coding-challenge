import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	
	@ViewChild('mainText') private mainText: ElementRef;
	@ViewChild('inputBox') private inputBox: ElementRef;
	@ViewChild('tagsInput') private tagsInput: ElementRef;
	savedAnnotations = [{start:1, end:8, comment:"test1", tags:["important", "nsfw"]}, {start: 19, end: 22, comment:"test2", tags:["funny", "nsfw"]}]; //list of annotations that were previously saved. Two examples are provided.
	activeSelection:any = {}; //the current selection
	allTags = []; //array for holding the list of tags
	showInputDialog = false;
	activeTag:any = {};
	
  ngOnInit() {
	this.renderHighlightedText();
  }
  
  renderHighlightedText(){
	  
    let originalText = "Lorem ipsum dolor sit amet, adipiscing elit. Aenean dictum elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse potenti. Ut porta venenatis velit, ac scelerisque nisi lobortis eu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In pellentesque elementum dolor vel aliquam. Integer maximus mattis nisi non efficitur. Nam elementum venenatis nibh sed feugiat. Aliquam a diam sed nulla lobortis sollicitudin ac vel lorem. Duis eu dui id sem dapibus sodales egestas et arcu. Aenean convallis nunc eu risus bibendum efficitur. Aenean congue sapien a tortor aliquam rhoncus. Nulla blandit suscipit justo, ac tincidunt mauris pharetra in. Phasellus congue congue convallis. Nullam feugiat nisl vel gravida rutrum. Vestibulum id quam gravida, gravida mauris id, bibendum nulla. Fusce vitae felis malesuada, mattis sem a, mattis risus. Aenean mollis, leo et consectetur tincidunt neque porttitor sapien, luctus auctor magna mi vel ante. suscipit tortor sed leo tincidunt egestas. Integer eu dui dapibus, lacinia purus quis, tempor sem. Morbi in malesuada justo. Morbi et neque tincidunt, consectetur lacus nec, ornare velit. Ut sit amet laoreet massa. Sed a erat risus. Aenean vulputate diam augue, non egestas velit tristique id. Suspendisse potenti. Praesent sollicitudin, quam nec tempor molestie, elit vehicula quam, fringilla fermentum massa nulla eu elit. Nullam nec egestas arcu, ac maximus odio. Integer ac vulputate libero. In ac dui eget felis laoreet placerat. Morbi dapibus turpis at enim ultricies, eget venenatis risus elementum. Cras molestie arcu eget magna tristique, nec tristique tellus venenatis. Praesent at scelerisque velit. Cras nec est magna. Vivamus vitae porta dolor. Vivamus felis dui, tincidunt ac nisl non, suscipit luctus metus. Nullam viverra ante nunc, eget ullamcorper lacus fringilla vel. Nam non dui ex. Vivamus nunc lacus, mollis eget lectus in, finibus molestie tellus. Etiam interdum libero enim, pretium laoreet mauris volutpat vel. Ut ornare ultrices velit, a rutrum odio blandit non. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla pharetra odio ut nulla aliquam sagittis. Quisque nisl orci, fringilla et tellus ut, ornare vehicula nulla. Quisque condimentum et massa ut aliquam. Integer vestibulum tellus sed dui vehicula, eu elementum elit varius. Aenean libero dolor, vulputate quis vitae, laoreet sit amet felis. Pellentesque sit amet laoreet sem, sit amet scelerisque arcu. Praesent pulvinar mauris a finibus porttitor. Aenean sodales convallis mi, quis tincidunt ante consequat.";
	
	//sort annotations by starting index
	this.savedAnnotations.sort(function(a,b){
			return a.start - b.start;
		}
	)
	
	var newText = "";
	this.allTags = [];
	
	//loop thorugh the annotations and dynamically build a new text string with dynamically inserted highlight html tags
	for(var i=0; i<this.savedAnnotations.length; i++){
		
		//add the annotation's tags to the global list of tags
		this.allTags = this.allTags.concat(this.savedAnnotations[i].tags);
		
		var self = this;
		
		//if an active tag is selected, check if the current annotation contains that tag
		if('name' in this.activeTag){
			var tagFound = this.savedAnnotations[i].tags.indexOf(this.activeTag.name) > -1;
		}

		var color="yellow";
		if(tagFound) {color="orange"};
		
		//if we are on the first annotation, start the slice from the beginning of the text
		if(i==0) {
			newText += originalText.slice(0, this.savedAnnotations[i].start);
		}
		
		newText += ("<span style='background-color:"+color+"' title='"+this.savedAnnotations[i].comment+"'>"+originalText.slice(this.savedAnnotations[i].start, this.savedAnnotations[i].end)+"</span>");
		
		//if the next annotation exists, append the text segment between the end of this annotation and the beginning of the next
		if(this.savedAnnotations[i] && this.savedAnnotations[i+1]) {
			newText += originalText.slice(this.savedAnnotations[i].end, this.savedAnnotations[i+1].start);
		}
		
		//if it's the last annotation, append the text which spans from the end of this annotation until the end of the text
		if(i==this.savedAnnotations.length-1){
			newText += originalText.slice(this.savedAnnotations[i].end, originalText.length);
		}
		
	}
	
	
	
	//remove duplicate tags and add an "active" flag to the list of tags
	this.allTags = this.allTags.filter(this.onlyUnique);
	var temp = [];
	this.allTags.forEach(function(e){
			temp.push({name:e, active:true});
		}
	)
	this.allTags = temp;
	
	this.mainText.nativeElement.innerHTML = newText;
  }
  
  //called when the user selects a text range
  highlightActive(){
	    
		var self = this;
	  
		var selection = window.getSelection();
		
		//if the selection is length 0 (e.g. user clicked without dragging), ignore
		if(selection.anchorNode == selection.focusNode && selection.anchorOffset == selection.focusOffset) {
			this.showInputDialog = false;
			this.clearPreviousActiveHighlights();
			return;
		}
		
		this.activeSelection.start = this.calculateNodePosition(window.getSelection().anchorNode)+window.getSelection().anchorOffset;
		this.activeSelection.end = this.calculateNodePosition(window.getSelection().focusNode)+window.getSelection().focusOffset;
		
		if(this.activeSelection.start > this.activeSelection.end) {
			var temp = this.activeSelection.start;
			this.activeSelection.start = this.activeSelection.end;
			this.activeSelection.end = temp;
		}
		
		this.clearPreviousActiveHighlights();
		
		//check if the selection is valid, i.e. must not overlap with an existing selection
		var validSelection = true;
		this.savedAnnotations.forEach(function(annot) {
				if((annot.end > self.activeSelection.start && annot.end <= self.activeSelection.end) ||
				   (annot.start >= self.activeSelection.start && annot.start < self.activeSelection.end)){
					self.activeSelection = {}
					validSelection = false;
					alert("please select a range that does not overlap with an existing range");
				}
			}
		)
		
		if(validSelection) {
			this.highlightSelection("Aqua");
			this.showInputDialog = true;
		}else{
			this.showInputDialog = false;
		}

  }
  
  //clear the last highlighted range by stripping the html formatting tags
  clearPreviousActiveHighlights(){
		this.mainText.nativeElement.childNodes.forEach(function(e){
			if(e.style){
				console.log(e.style.backgroundColor);
				if(e.style.backgroundColor=="aqua") {
					e.replaceWith(document.createTextNode(e.textContent));
				}
			}
			
		}
	  );
  }
  
  saveActiveHighlight(){
	  
	  //grab user inputs and save the new annotation
	  this.activeSelection.comment = this.inputBox.nativeElement.value;
	  var tags = this.tagsInput.nativeElement.value.split(",");
	  tags = tags.filter(Boolean);
	  this.activeSelection.tags = tags;
	  this.savedAnnotations.push(this.activeSelection);
	  
	  //reset input and rerender the text after saving the new annotation
	  this.inputBox.nativeElement.value = "";
	  this.tagsInput.nativeElement.value = "";
	  this.activeSelection = {};
	  this.renderHighlightedText();
	  this.showInputDialog = false;
	  
  }
  
  //calculates the position index of a given a DOM node relative to the main text block
  calculateNodePosition(node){
	var index = 0;
    var currNode = node;
	var prevNode = null;
	
	if(node.parentNode.id == "mainText"){
		prevNode = node.previousSibling;
	}else{
		prevNode = node.parentNode.previousSibling;
	}
	
	while(prevNode) {
		index += prevNode.textContent.length;
		
		if(prevNode.parentNode.id == "mainText"){
			prevNode = prevNode.previousSibling;
		}else{
			prevNode = prevNode.parentNode.previousSibling;
		}
	}
	return index;
  }
  
  highlightSelection(color) {
	document.designMode = "on";
	document.execCommand("HiliteColor", false, color);
	document.designMode = "off";
  }
  
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
  //sets the active tag and highlights any annotations containing that tag in orange
  filterByTag(tag) {
	  var currentTag = this.allTags.find(elem => elem.name==tag.name);
	  this.activeTag = currentTag;
	  console.log(this.activeTag);
	  this.renderHighlightedText();
  }
  
}
