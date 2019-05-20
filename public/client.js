$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  var glcbalBookCounter=0;
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {

      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');

      glcbalBookCounter=i;
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  var comments = [];

  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li class="commentsList">' +val+ '</li>');
      });

      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));

    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        if(data.status==200){
          glcbalBookCounter++;
          itemsRaw.pop();
          $('<ul/>', {
            'class': 'listWrapper',
            html: itemsRaw.join('')
          }).appendTo('#display');

        }
        $('#detailComments').html('<p style="color: red;">'+data.msg+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function(e) {

    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        alert("Result=="+JSON.stringify(data))
        if(data.status==200){
          glcbalBookCounter++;
          itemsRaw.push(data);
          alert("glcbalBookCounter=="+glcbalBookCounter);
          var result='<li class="bookItem" id="' + glcbalBookCounter + '">' + data.title + ' - ' + data.commentcount + ' comments</li>';
          $('<ul/>', {
            'class': 'listWrapper',
            html: result
          }).appendTo('#display');

        }
        //update list
      }
    });
    e.preventDefault();
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list


      }
    });
  }); 
  
});