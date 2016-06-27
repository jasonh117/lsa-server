/**
 * Created by JasonHsieh on 6/27/16.
 */

var socket = io();

function gen_chat_message(msg) {
    var message =
        `<div class="chat_message_container">
            <div class="chat_message_info">
                author - date
            </div>
            <div class="chat_message">${msg}</div>
        </div>`;
    return message;
}

$(function() {
    $('#chat_text_area').keypress(function(e) {
        if((e.keyCode || e.which) == 13 && $.trim($(this).val())) {
            socket.emit('chat message', $(this).val());
            $(this).val('');
            event.preventDefault();
        }
    });
    
    socket.on('chat message', function(msg){
        var chat_container = $('#chat_middle_container');
        chat_container.append(gen_chat_message(msg));
        chat_container.scrollTop(chat_container.prop('scrollHeight'));
    });

});
