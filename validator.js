
var Input = function (elm) {
    this.id = elm;
    var self = null;
    var element = $(elm);
    var nodeName = $(elm).prop('nodeName');
    var type = element.attr('type');
    var minlength = element.data('minlength');
    var maxlength = element.data('maxlength');
    var required = element.prop('required');
    var isEmail = element.data('email') == undefined ? false : element.data('email');
    var changed = null;
    var MinLength = minlength != undefined && isNaN(Number(minlength)) == false ? Number(minlength) : 0;
    var MaxLength = maxlength != undefined && isNaN(Number(maxlength)) == false ? Number(maxlength) : 0;
    var IsRequired = required;
    var valid = false;
    this.didFirstRun = false;
    var setInputsEvents = function () {
        $(elm).keyup(function () {
            ValidateInput();
        });
        $(elm).on("paste", function () {
            ValidateInput();
        });
        $(elm).on("cut", function () {
            ValidateInput();
        });
        $(elm).focus(function () {
            ValidateInput();
            if (changed != null) {
                self.didFirstRun = true;
                changed(valid, self.didFirstRun);
            }
        });
    };
    this.Valid = function(prop){

        if(prop == undefined){
            return valid;
        }
        else if(prop != undefined){
            if(prop == valid){
                return;
            }
            else{
                valid = prop;
                if (changed != null) {
                    var oldValue = this.didFirstRun;
                    this.didFirstRun = true;
                    changed(valid, oldValue);

                }
            }
        }
    };
    this.Changed = function (callback) {
        changed = callback;
    };
    var checkTextInputIsValid = function () {
        var semivalid = false;
        var isrequiredvalid = false;
        var isemailrequired = false;
        if (IsRequired == true) {
            isrequiredvalid = element.val().length > 0;
        } else {
            isrequiredvalid = true;
        }
        if(isEmail == true){
            isemailrequired = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(element.val());
        }
        else{
            isemailrequired = true;
        }

        if (MinLength == 0 && MaxLength == 0) {
            semivalid = true;
        } else if (MinLength > 0 && MaxLength == 0) {
            semivalid = element.val().length >= MinLength;
        } else if (MinLength == 0 && MaxLength > 0) {
            semivalid = element.val().length <= MaxLength;
        } else if (MinLength > 0 && MaxLength > 0) {
            if (MinLength <= MaxLength) {
                if (MinLength <= element.val().length && element.val().length <= MaxLength) {
                    semivalid = true;
                } else {

                    semivalid = false;
                }
            } else {
                console.error('minlength can not be great from maxlength error about : ' + elm);
            }
        }
        self.Valid(semivalid && isrequiredvalid && isemailrequired);
    };
    var ValidateSelect = function(){
        var isValid = false;
        if(IsRequired == true){
            isValid = element.val() == "" ? false : true;
        }
        else{
            isValid = true;
        }
        self.Valid(isValid);
    };
    var ValidateInput = function () {
        if(nodeName == "INPUT"){
            switch (type) {
                case 'text':
                    checkTextInputIsValid();
                    break;
                case 'hidden':
                    checkTextInputIsValid();
                    break;
                case 'email':
                    checkTextInputIsValid();
                    break;
                default:

                    break;

            }
        }
        else if(nodeName == "TEXTAREA"){
            checkTextInputIsValid();
        }
    };
    this.Initialize = function (isExceptional) {
        self = this;
        switch(nodeName){
            case "INPUT":
                setInputsEvents();
                if($(elm).val() != ''){
                    ValidateInput();
                }
              //
                break;
            case "SELECT":
                $(elm).on('change',function () {
                    ValidateSelect();
                });
                $(elm).focus(function () {
                    ValidateSelect();
                    if (changed != null) {
                        self.didFirstRun = true;
                        changed(valid, self.didFirstRun);
                    }
                });
                if($(elm).val() != ''){
                    ValidateSelect();
                }
              //  ValidateSelect();
                break;
            case "TEXTAREA":
                    setInputsEvents();
                 //   ValidateInput();
                break;
        }
    };
    this.ValidateAndCallBack = function () {
        ValidateInput();
        this.didFirstRun = true;
        changed(valid, this.didFirstRun, "triggered");
    };
    this.ValidateSelectAndCallBack = function () {
        ValidateSelect();
        this.didFirstRun = true;
        changed(valid, this.didFirstRun, "triggered");
    };
    this.TriggerChanged = function () {
        if (changed != null) {
            this.didFirstRun = true;
            changed(valid, this.didFirstRun, "triggered");
        }
    };
};
var Validator = function () {
    var Inputs = [];
    var elementChange = null;
    var allValid = null;
    var willTextClear = null;
    var restrictions = [];
    var hasAnyNotValid = function (element, index, array) {
        return element.Valid() === false;
    };
    var observeElement = function (elm) {
        switch ($(elm).prop('nodeName')) {
            case "INPUT":
                if ($(elm).attr('type') != 'button') {
                    var input = new Input(elm);
                    input.Changed(function (value) {
                        var foundIndex = Inputs.findIndex(function (x) {
                            return x.id == input.id;
                        });
                        Inputs[foundIndex].Valid(value);
                        if(elementChange != null){
                            elementChange(Inputs[foundIndex]);
                        }
                        controlAllValid();

                    });
                    Inputs.push(input);
                    input.Initialize();
                    if(elementChange != null){
                        elementChange(input);
                    }
                } else {
                    console.error('This Function only Works With Inputs I am Sorry! error about = ' + $(elm).attr('id'));
                }
                break;
            case "SELECT":
                var selectInput = new Input(elm);
                selectInput.Changed(function (value) {
                    var foundIndex = Inputs.findIndex(function (x) {
                        return x.id == selectInput.id;
                    });
                    Inputs[foundIndex].Valid(value);
                    if(elementChange != null){
                        elementChange(Inputs[foundIndex]);
                    }
                    controlAllValid();
                });
                Inputs.push(selectInput);
                selectInput.Initialize();
                if(elementChange != null){
                    elementChange(selectInput);
                }
                break;

            case "TEXTAREA":
                if ($(elm).attr('type') != 'button') {
                    var input = new Input(elm);
                    input.Changed(function (value) {
                        var foundIndex = Inputs.findIndex(function (x) {
                            return x.id == input.id;
                        });
                        Inputs[foundIndex].Valid(value);
                        if(elementChange != null){
                            elementChange(Inputs[foundIndex]);
                        }
                        controlAllValid();

                    });
                    Inputs.push(input);
                    input.Initialize();
                    if(elementChange != null){
                        elementChange(input);
                    }
                } else {
                    console.error('This Function only Works With Inputs I am Sorry! error about = ' + $(elm).attr('id'));
                }
                break;
        }
    };
    var controlAllValid = function () {
        if(!Inputs.some(hasAnyNotValid)){
            if(allValid != null){
                allValid();
            }
        }
    };
    var checkInputInRestrictionsList = function (id) {
        for (var i= 0; i<restrictions.length ; i++){
            if(id == restrictions[i]){
                return false;
                break;
            }
        }
        return true;
    };
    this.GetElementWithID = function(id){
        for (var i= 0; i<Inputs.length ; i++){
            if(id == Inputs[i].id){
                return Inputs[i];
                break;
            }
        }
        return null;
    };
    this.GetElements = function(){
        return Inputs;
    };
    this.ControlAllValid = function () {
        if(Inputs.some(hasAnyNotValid) == true){
            return false;
        }
        else{
            return true;
        }
    };
    this.ObserveElement = observeElement;
    this.ElementChanged = function(callback){
        elementChange = callback;
    };
    this.AllElementsValidated = function(callback){
        allValid = callback;
    };
    this.GetNotValid = function(){
        var notvalid  = [];
        Inputs.map(function (item, index) {
            if(item.Valid() == false){
                notvalid.push(item.id);
            }
        }) ;
        return notvalid;
    };
    this.HasAnyValid = function () {
        var anyvalid  = false;
        Inputs.map(function (item, index) {
            if(item.Valid() == true){
                anyvalid = true;
            }
        }) ;
        return anyvalid;
    };
    this.WillClearValue = function (prop) {
        if(prop == undefined){
            return willTextClear;
        }
        else{
            willTextClear = prop;
        }
    };
    this.AddRestrictions = function (id) {
        restrictions.push(id);
    };
    this.GetRestrictions = function () {
        return restrictions;
    };
    this.ObserveElementGroup = function(parent){
        var elements = $(parent).find('input, select, textarea');
        elements.map(function(index, item){
            if(!$(item).hasClass('quill-editor-text-area') && $(item).data('validate') != undefined && $(item).data('validate') != false && checkInputInRestrictionsList($(item).attr('id'))) {
                observeElement('#' + $(item).attr('id'));
            }

        });
    };
    this.ClearSettings = function () {
        Inputs.map(function (index, item) {
            $(item.id).off("keyup");
            $(item.id).off("cut");
            $(item.id).off("copy");
            $(item.id).off("change");
        });
        if (willTextClear != null){
            willTextClear.map(function (index, item) {
                $(item).val("");
            });
        }
        Inputs = [];
        restrictions = [];
    };
    this.TriggerAll = function () {
        Inputs.map(function (item, index) {
            item.TriggerChanged();
        });
    };

};

