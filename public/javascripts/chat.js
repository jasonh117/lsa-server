/**
 * Created by JasonHsieh on 6/27/16.
 */

var socket = io();

function add_chat_message(chat) {
    var chat_container = $('#chat_middle_container');
    var date = moment(chat.createdAt).format('MMM D, h:mm a');
    var message =
        `<div class="chat_message_container">
            <p class="chat_message_info">${chat.author.name} on ${date}</p>
            <p class="chat_message">${chat.body}</p>
        </div>`;
    chat_container.append(message);
    chat_container.scrollTop(chat_container.prop('scrollHeight'));
}

$(function() {
    $.get("/chat", function(chats) {
        chats.data.map(function(chat) {
            add_chat_message(chat);
        });
    });

    $('#chat_text_area').keypress(function(e) {
        if((e.keyCode || e.which) === 13 && $.trim($(this).val())) {
            $.post("/chat", {msg: $(this).val()});
            $(this).val('');
            event.preventDefault();
        }
    });

    socket.on('chat message', function(msg){
        add_chat_message(msg);
    });

});
