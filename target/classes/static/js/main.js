var currentNote;
var countOfNotes;
var allNotes = [];
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
    countOfNotes = allNotes.length;
    var order;
    if (countOfNotes === 0) {
        order = 1;
    } else {
        order = countOfNotes + 1;
    }
    var newNote = $("#new-note").val();
    $("#new-note").val("");
    if (newNote != false) {
        saveNoteToDB(newNote, order);
    }
}

function saveNoteToDB(newNote, order) {
    var noteObj = {
        text: newNote,
        styleNumber: order
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
    deleteNoteFromList(id);
    console.log("deleted from list:");
    console.log(allNotes);
    deleteNoteFromDB(id);
}

function deleteNoteFromList(id) {
    for (var i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id == id) {
            allNotes.splice(i, 1);
            console.log('deleted successfully');
        }
    }
}

function deleteNoteFromDB(id) {
    console.log(id);
    $.delete("http://localhost:8080/notes/" + id)
        .done(function (data) {
            console.log("successfully deleted");
            console.log(data);
            updateNotes(allNotes);
        });
}

function updateNotes(notes) {
    var jsonNotes = JSON.stringify(notes);
    $.put("http://localhost:8080/notes/all", jsonNotes)
        .done(function (data) {
            console.log("Data updated: " + data);
            $(".notes").empty();
            getAllNotes();
        });
}

function getAllNotes() {
    $.get("http://localhost:8080/notes", function (resp) {
        allNotes = resp;
        countOfNotes = allNotes.length;
        for (var i = 0; i < allNotes.length; i++) {
            $(".notes").append(`<section id="${allNotes[i].id}" class="nts" onclick="selectNote()" ondblclick="unSelectNote()" 
                            style="order:${allNotes[i].styleNumber}">  ${allNotes[i].text} </section>`)
        }
        allNotes.sort(sortByStyle);
        console.log("loaded list:");
        console.log(allNotes);
    });
}

$(document).ready(function () {
    getAllNotes();
});

function selectNote() {
    currentNote = event.target;
    $(".active") ? $(".active").removeClass("active") : '';
    $(".controllers").css("display", "flex");
    $(currentNote).addClass("   active");
    console.log($(currentNote).css("order") + " - current order");
}

function noteUp() {
    var currentOrder = $(currentNote).css("order");
    if (currentOrder > 1) {
        var previousNote = getElementByStyle(currentOrder - 1);
        $(previousNote).css("order", currentOrder);
        $(currentNote).css("order", currentOrder - 1);
        updateStyleInDb(currentNote, previousNote);
        allNotes.sort(sortByStyle);
    }

}

function noteDown() {
    var currentOrder = $(currentNote).css("order");
    if (currentOrder < countOfNotes) {
        var nextNote = getElementByStyle(+currentOrder + 1);
        $(nextNote).css("order", currentOrder);
        $(currentNote).css("order", +currentOrder + 1);
        updateStyleInDb(currentNote, nextNote);
        allNotes.sort(sortByStyle);
    }
}

function updateStyleInDb(currentNote, otherNote) {
    var currentId = $(currentNote).attr('id');
    var otherId = $(otherNote).attr('id');
    var currentNoteObj = {
        text: $(currentNote).text(),
        styleNumber: $(currentNote).css("order")
    }
    var otherNoteObj = {
        text: $(otherNote).text(),
        styleNumber: $(otherNote).css("order")
    }
    var currentJsonNote = JSON.stringify(currentNoteObj);
    var otherJsonNote = JSON.stringify(otherNoteObj);
    $.put("http://localhost:8080/notes?id=" + currentId, currentJsonNote)
        .done(function (data) {
            console.log("Data updated: " + data);
            $.put("http://localhost:8080/notes?id=" + otherId, otherJsonNote)
                .done(function (data) {
                    console.log("Data updated: " + data);
                });
        });
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
    updateNoteInDB(id, newNote, $(currentNote).css("order"));
    $(".save-note-btn").css("display", "block");
    $(".update-note-btn").css("display", "none");
}

function updateNoteInDB(id, newNote, style) {
    var noteObj = {
        text: newNote,
        styleNumber: style
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

function sortByStyle(a, b) {
    return (a.styleNumber - b.styleNumber);
}

function getAllSections() {
    return document.getElementsByClassName("nts");
}