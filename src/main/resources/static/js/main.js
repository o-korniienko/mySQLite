var currentNote;
jQuery.each(["put", "delete", "post"], function (i, method) {
    jQuery[method] = function (url, data, callback) {
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: data,
            success: callback
        });
    };
});


function saveNote() {
    var newNote = $("#new-note").val();
    $("#new-note").val("");
    if (newNote != false) {
        insertNote(newNote);
        saveNoteToDB(newNote);
    }
}

function saveNoteToDB(newNote) {
    var noteObj = {
        text: newNote
    }
    var jsonNote = JSON.stringify(noteObj);
    $.post("http://localhost:8080/notes", jsonNote)
        .done(function (data) {
            console.log("Successfully saved: " + jsonNote)
            $(".notes").empty();
            getAllNotes()
        });
}

function deleteNote() {
    $(currentNote).css("display", "none");
    var id = $(currentNote).attr('id');
    deleteNoteFromDB(id);
}

function deleteNoteFromDB(id) {
    console.log(id);
    $.delete("http://localhost:8080/notes/" + id)
        .done(function (data) {
            console.log("successfully deleted");
            console.log(data);
        });
}

function getAllNotes() {
    $.get("http://localhost:8080/notes", function (resp) {
        var allNotes = resp;
        countOfNotes = allNotes.length;
        for (var i = 0; i < allNotes.length; i++) {
            $(".notes").append(`<section id="${allNotes[i].id}" onclick="selectNote()" ondblclick="unSelectNote()" 
                            style="order: ${i + 1}">  ${allNotes[i].text} </section>`)
        }
    });
}

function insertNote(newNote) {
    var length = $(".notes > section").length;
    var viewTemplete = `<section id="" style="order: ${length + 1}" onclick="selectNote()" ondblclick="unSelectNote()">${newNote}</section>`;
    $(".notes").append(viewTemplete);
}

$(document).ready(function () {
    getAllNotes();
});

function selectNote() {
    currentNote = event.target;
    $(".active") ? $(".active").removeClass("active") : '';
    $(".controllers").css("display", "flex");
    $(currentNote).addClass("   active");
}

function noteUp() {
    var currentOrder = $(currentNote).css("order");
    if (currentOrder > 1) {
        var previousNote = getElementByStyle(currentOrder - 1);
        $(previousNote).css("order", currentOrder);
        $(currentNote).css("order", currentOrder - 1);
    }

}

function noteDown() {
    var currentOrder = $(currentNote).css("order");
    if (currentOrder < countOfNotes) {
        var nextNote = getElementByStyle(+currentOrder + 1);
        $(nextNote).css("order", currentOrder);
        $(currentNote).css("order", +currentOrder + 1);
    }
}

function editNote() {
    $("#new-note").val($(currentNote).text());
    $(".save-note-btn").css("display", "none");
    $(".update-note-btn").css("display", "block");
}

function unSelectNote() {
    $(".controllers").css("display", "none");
    $(".update-note-btn").css("display", "none");
    $(".save-note-btn").css("display", "block");
}

function updateNote() {
    $(currentNote).text($("#new-note").val());
    $("#new-note").val("");
    var newNote = $(currentNote).text();
    var id = $(currentNote).attr('id');
    updateNoteInDB(id, newNote);
    $(".save-note-btn").css("display", "block");
    $(".update-note-btn").css("display", "none");
}

function updateNoteInDB(id, newNote) {
    var noteObj = {
        text: newNote
    }
    var jsonNote = JSON.stringify(noteObj);
    $.put("http://localhost:8080/notes?id=" + id, jsonNote)
        .done(function (data) {
            console.log("Data updated: " + data);
        });
}


function getElementByStyle(styleNumber) {
    styleNumber = styleNumber.toString();
    var tags = document.getElementsByTagName('section');
    var s;
    for (var i = 0; i < tags.length; i++) {
        if (($(tags[i]).css("order")) === styleNumber) {
            previousNote = tags[i];
            s = tags[i];
        }
    }
    return s;
}