# Form Validator

### Example

```
// Create Instance for Validator
var validator = new Validator();

// If Form has Restrictions
for (var i = 0; i < restrictionsList; i++){
     validator.AddRestrictions($(restrictionsLis[i]).attr('id'));
}

//Observe All Inputs Inside Form Except Restricted Inputs 
validator.ObserveElementGroup('#form')

validator.ElementChanged(function(item, message){
    if (item.didFirstRun != false){
        if (item.Valid()) {
		// Do UI Manipulation Element Valid
        } else {
		// Do UI Manipulation Element Invalid
        }
    }
});

validator.AllElementsValidated(function(){
	// Validation Completed You Can Submit
});

// or

$('#form').submit(function (e) {
    if(validator.ControlAllValid(){
		//Submit
	}
	else{
		// Trigger all Elements for Ui Manipulation (it will focus to invalid elements)
		validator.TriggerAll();
		e.preventDefault();
	}
});

```
