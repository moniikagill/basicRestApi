$(document).ready(function(e) {
  var ERROR_LOG = console.error.bind(console);

  //loadmylist loads the list uses get
  loadmyList();


// add-todo button to add a new task
  $('#add-todo').button({
    icons: { primary: "ui-icon-circle-plus" }}).click(
      function() {
        $('#task').val("");
        $('#user').val("");
        $('#new-todo').dialog('open');
      });


// add new todo dialog opens
      $('#new-todo').dialog({
        modal : true, autoOpen : false, buttons : {
          "Add task" : function (evt) {
            evt.preventDefault();

            var taskName = $('#task').val();
            var userName = $('#user').val(); //
            addNewTask(taskName,userName);
            if (taskName === ''|| userName === '') { return false; }

          // refreshes my page

           location.reload();

            var taskHTML = '<li><span class="done">%</span>';
            taskHTML += '<span class="edit">+</span>';
            taskHTML += '<span class="delete">x</span>';
            taskHTML += '<span class="task"></span>';
            taskHTML += '<span class="user"></span></li>';
            var $newTask = $(taskHTML);
           $newTask.find('.task').text(taskName);
           $newTask.find('.user').text(userName);
           $newTask.hide();
           $('#todo-list').prepend($newTask);
           $newTask.show('clip',250).effect('highlight',1000);
           var ERROR_LOG = console.error.bind(console);
           $(this).dialog('close');
           },
          "Cancel" : function () { $(this).dialog('close'); } }
        });

        // done function moves incomplete to completed
        $('#todo-list').on('click', '.done', function() {
          var currentTask = $(this);
          var $taskItem = $(this).parent('li');
          $taskItem.slideUp(250, function() {
            var $this = $(this);
            $this.detach();
            $('#completed-list').prepend($this);
            $this.slideDown();});
              var id = currentTask.parent('li').data("item").id; //for completed task
              var comp = currentTask.parent('li').data("item").completed;
              completedtest(id,comp);
              console.log("testing completed"+completed); // testing in console to see if task is moving to correct place
          });



          $('.sortlist').sortable({ connectWith : '.sortlist',
          cursor : 'pointer',
          placeholder : 'ui-state-highlight',
          cancel : '.delete,.done',
          start:function(event,ui){

            console.log($(ui.item).data("item").id);
            console.log($(ui.item).parent("ul").attr("id"));
            console.log("start");
            ui.item.data("from",$(ui.item).parent("ul").attr("id"));
          },
          update:function(event,ui){
  //var id = currentTask.parent('li').data("item").id;
  var id = $(ui.item).data("item").id;
  var comp = $(ui.item).data("item").completed;
            console.log($(ui.item).data("item").id);
            console.log("to",$(ui.item).parent("ul").attr("id"));
            console.log("update");
            ui.item.data("from");
            console.log("from",ui.item.data("from"));
           completedtest(id,comp);
          }
        });



        // delete function calls delete task that calls delete api function to delete task from database
          $('.sortlist').on('click','.delete',function() {
          var currentTask = $(this);
          var li = $(this).closest("li");
          $('#completed-task').dialog({modal : true, buttons : {
            "Delete" : function(){
              var id = currentTask.parent('li').data("item").id;
              // calling deleteTask() function here to delete a specific task
              deleteTask(id);
              $(this).dialog('close');
              li.effect('puff', function() {
                li.remove();
              });
            },
            "Cancel" : function () { $(this).dialog('close');
          }
        }
      });
    });

    // edit function, also calls updateTask to update task in database
    $('#todo-list').on('click','.edit',function() {
      console.log('testingfunction');
      var ed = $(this).siblings('.task');
      var ed2 = $(this).siblings('.user');
      var currentTask = $(this);
      console.log(ed,"-ed");
      console.log(this,"this");
      console.log(ed2,"-ed2");
      console.log(this,"this");
      var z = ed.text();
      var y = ed2.text();
      console.log(z,'text value');
      console.log(y,'text value');
      $('#task2').val(z);
      $('#task3').val(y);
      $('#edit-todo').dialog({modal : true, buttons : {
    "Confirm" : function(){
          var x  = $('#task2').val();
          ed.text(x);
          console.log(x+"testing taskname");
          var m  = $('#task3').val();
          ed2.text(m);
          var taskName = $('#task2').val();
          var userName = $('#task3').val();
          var id = currentTask.parent('li').data("item").id;

          // calls updateTask to update task in database
           updateTask(id, taskName, userName);
          $(this).dialog('close');
        },
        "Cancel" : function () { $(this).dialog('close');
      }
    }
  });
});
//******************************************************************************************/
  //  The functions with  Ajax calls to utilize the RESTful web service
// ***************************************************************************************/


// this function loads my table from database
function loadmyList () {
  $('#todo-list').empty();
    $.ajax({
    url: '/api/todolist',
    contentType: "application/json",
    dataType: 'json',
    type: 'GET',
    success: function(todolistdata){
    var taskname = todolistdata[0];
     console.log(taskname);
   }

  }).done(function(todolistdata){
      for(var x = 0;x<todolistdata.length;x++){
      console.log(x);
      console.log("test loadmylist"+todolistdata[x].taskowner);
      var taskName = todolistdata[x].taskname;
      var userName = todolistdata[x].taskowner;
      var taskHTML = '<li><span class="done">%</span>';
      taskHTML += '<span class="edit">+</span>';
      taskHTML += '<span class="delete">x</span>';
      taskHTML += '<span class="task"></span>';
      taskHTML += '<span class="user"></span></li>';
      var $newTask = $(taskHTML);
      $newTask.find('.task').text(taskName);
      $newTask.find('.user').text(userName);
      $newTask.data("item", todolistdata[x]);
      if(todolistdata[x].completed){
      $('#completed-list').prepend($newTask);
       }
      else{
      $('#todo-list').prepend($newTask);}
       $newTask.show('clip',250).effect('highlight',1000);

    }

  });
}


// this function changes the completed field to true if task is completed or viceversa
function completedtest(id,complete){
  $.ajax({
  url: `/api/todolist/update/${id}`,
  type: 'PUT',
  data: JSON.stringify({
  completed:!complete
  }),
  contentType: "application/json",
    dataType: 'json'
  }).done(function() { console.log('Request done!'); })
        .fail(function() { alert('failed'); });
}



// this function adds a new task to database using taskname and username
function addNewTask(taskName,userName){
  $.ajax({
  url: '/api/todolist/create',
  contentType: "application/json",
  type: 'POST',
  data: JSON.stringify({
    taskname: taskName,
    taskowner: userName
  }),
  contentType: "application/json",
    dataType: 'json'

  }).done(function() { alert('Task added successfully!');
   }).fail(function() { alert('failed'); });
}


 // this function updates the task, changed taskowner and taskname

 function updateTask(id, taskName, taskOwner){
   $.ajax({
   url: '/api/todolist/update',
   type: 'PUT',
   data: JSON.stringify({
   id: id,
   taskname: taskName,
   taskowner: taskOwner
   }),
   contentType: "application/json",
     dataType: 'json'
   }).done(function() { alert('Request done!'); })
         .fail(function() { alert('failed'); });
}


// this function deletes a task
function deleteTask(id){
  console.log("testingdelete");
  $.ajax({
  url: '/api/delete',
type: 'DELETE',
data: JSON.stringify({
    id: id

  }),
  contentType: "application/json",
    dataType: 'json'
  }).done(function() { console.log("end of delete"); alert('Request done, Task deleted!'); })
        .fail(function() { alert('testdeletefor error'); });
  }

//******************************************************************************************/

});
