/**
 * Created by JasonHsieh on 6/14/16.
 */

var cards = {};
var tags = [];
var card_id = null;

function get_server_cards(query) {
    $.ajax({
        url: "/api/",

        data: {
            search: query
        },

        type: "GET"
    })

    .done(function(object) {
        var data = object.data;
        for (var index in data) {
            var new_card = gen_preview_card(addcard(data[index]));
            $("#main_container").prepend(new_card);
        }
    })
}

function send_new_card() {
    $.ajax({
        url: "/api/",

        data: {
            title: $('#new_card_title').val(),
            tags: tags,
            body: $('#new_card_notes').val()
        },

        traditional: true,

        type: "POST"
    })

    .done(function(object) {
        var new_card = gen_preview_card(addcard(object.data));
        $("#main_container").prepend(new_card);
        reset_card();
        card_id = null;
    })
}

function send_edits() {
    $.ajax({
        url: "/api/" + card_id,

        data: {
            title: $('#new_card_title').val(),
            tags: tags,
            body: $('#new_card_notes').val()
        },

        traditional: true,

        type: "PATCH"
    })

    .done(function(object) {
        var new_card = gen_preview_card(addcard(object.data));
        $("#"+card_id).replaceWith(new_card);
        reset_card();
        card_id = null;
    })
}

function send_delete_card() {
    $.ajax({
        url: "/api/" + card_id,

        type: "DELETE"
    })

    .done(function() {
        reset_card();
        delcard(card_id);
        $("#"+card_id).remove();
        card_id = null;
    })
}

function addcard(card) {
    return cards[card._id] = card;
}

function delcard(id) {
    delete cards[id];
}

function normal_card(data) {
    card_id = data._id;
    $('.card_date').text(data.createdAt.substring(0,10));
    $('#normal_card .title').text(data.title);
    $('#normal_card .card_tags ul').empty();
    for (var tag in data.tags)
        $('#normal_card .card_tags ul').append($('<li>').text(data.tags[tag]));
    $('#normal_card .text_content_container').text(data.body);
    $('#normal_card').removeClass('hide');
}

function edit_card(data) {
    $('.card_date').text(data.createdAt.substring(0,10));
    $('#new_card_title').val(data.title);
    for (var index in data.tags) {
        tags.push(data.tags[index]);
        var tag = $('<li>').addClass("temp_tag").text(data.tags[index]);
        $('#temp_tags').append(tag);
    }
    $('#new_card_notes').val(data.body);
    $('#edit_card').removeClass('hide');
}

function reset_card() {
    tags = [];

    // Reset Normal & Edit Card
    $('.card').addClass('hide');
    $('.card_date').empty();

    // Reset Normal Card
    $('#normal_card .title').empty();
    $('#normal_card .card_tags ul').empty();
    $('#normal_card .text_content_container').empty();
    $('#normal_card .thumbnails-container').empty();

    // Reset Edit Card
    $('#new_card_title').val('');
    $('#new_card_notes').val('');
    $('#new_tag').val('');
    $('#temp_tags').empty();
}

function gen_preview_card(object) {
    var notes = object.body.replace(/\n/g, "<br>");

    var new_card =
        `<div class="preview preview_cards" id="${object._id}">
            <p class="title">${object.title}</p>
            <div class="card_tags">
                <ul>`;
    for (var tag in object.tags)
        new_card += `<li>${object.tags[tag]}</li>`;
    new_card +=
                `</ul>
            </div>
            <p class="preview_body">${notes}</p>
            <div class="preview_date">${object.createdAt.substring(0,10)}</div>
        </div>`;
    return $(new_card);
}

$(function() {
    if ($(location).attr('pathname') == '/')
      get_server_cards();

    // Open Edit Card

    $('#add_card_btn').on('click', function() {
        card_id = null;
        reset_card();
        $('#edit_card').removeClass('hide');
    });

    // Cancel the Edit or Normal Card

    $('.cancel_button').on('click', function() {
        card_id = null;
        reset_card();
    });

    // Save the card from the Edit Card

    $('.save_button').on('click', function() {
        if ($('#new_card_title').val() == "")
            $('#new_card_title').val("No Title");

        if (card_id == null)
            send_new_card();
        else
            send_edits();
    });

    // Add new tags in Edit Card

    $('#new_tag').keypress(function(e) {
        if((e.keyCode || e.which) == 13 && this.value != "") {
            var tag = $('<li>').addClass("temp_tag").text(this.value);
            $('#temp_tags').append(tag);
            tags.push(this.value);
            this.value = null;
        }
    });

    // Removing tags in Edit Card

    $('#temp_tags').on('click', '.temp_tag', function() {
        tags.splice(tags.indexOf(this.textContent), 1);
        this.remove();
    });

    // Open Normal Card when Preview Card pressed

    $('#main_container').on('click', '.preview_cards', function() {
        reset_card();

        // get id of preview card selected
        var id = $(this).attr("id");

        // show Normal Card with data
        normal_card(cards[id]);
    });

    // Deleting Card from Normal Card

    $('.delete_button').on('click', function() {
        send_delete_card();
    });

    // Edit Card from Normal Card

    $('.edit_button').on('click', function() {
        reset_card();

        // show Edit Card with data
        edit_card(cards[card_id]);
    });

    // Open Register Form

    $('#nav_register').on('click', function() {
        reset_card();
        $('#register').removeClass('hide');
    });

    // Open Login Form

    $('#nav_login').on('click', function() {
        reset_card();
        $('#login').removeClass('hide');
    });

    // Check Register Form for filled in data

    $('#reg_form').submit(function() {
        if ($('#reg_name').val() == '' || $('#reg_email').val() == '' || $('#reg_password').val() == '') {
            $('.form_info').text('form not filled out');
            return false;
        }
        return true;
    });

    // Check Login Form for fillin

    $('#login_form').submit(function() {
        if ($('#login_email').val() == '' || $('#login_password').val() == '') {
            $('.form_info').text('form not filled out');
            return false;
        }
        return true;
    });

    // searchbar

    $('#searchbar').keypress(function(e) {
        if((e.keyCode || e.which) == 13) {
            $('.preview_cards').remove();
            get_server_cards(this.value);
        }
    });

});
