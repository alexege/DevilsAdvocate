<template>
    <div>
        <confirm-dialog ref="confirmDialog"></confirm-dialog>

        [ <font-awesome-icon icon="arrow-up" class="arrow-up" @click="likeComment(thisComment)"/>
        <span style="padding: 5px">{{ thisComment.votes.length }}</span>
        <font-awesome-icon icon="arrow-down" class="arrow-down" @click="dislikeComment(thisComment)"/> ] [Author: {{ thisComment.author}}] [ID: {{thisComment._id}}] [Votes: {{thisComment.votes}}]
          
        <div v-if="isEditingComment" class="comment-edit">
            <input type="text" v-model="thisComment.body" class="comment-edit-input" :size="thisComment.body.length">
            <button @click.prevent="updateComment(thisComment)" >Save</button>
            <button @click.prevent="cancel" >Cancel</button>
        </div>

        <div v-else class="comment-edit" >
           
        <span class="comment-body" >{{ thisComment.body }}</span>
            <div style="display: inline-block; position: absolute; right: 0;">
            <a href="" @click.prevent="updateComment(thisComment)" class="edit-btn" v-if="isEditingComment"><font-awesome-icon icon="check" /></a>
            <a href="" @click.prevent="editComment(thisComment)"><font-awesome-icon icon="edit" class="action-icon" /></a>
            <a href="" @click.prevent="deleteComment(thisComment._id)"><font-awesome-icon icon="trash" class="action-icon"/></a>
            </div>
        </div>

    </div>
</template>
<script>
import ConfirmDialog from "../components/confirmDialog";

export default {
    name: "comment",
    components: { ConfirmDialog },
    props: ["thisComment"],
    data(){
        return {
            isEditingComment: false,
            isModalVisible: false,
            currentUser: null,

            commentToEdit: {},
        }
    },
    methods: {
    likeComment(comment) {
      
      const currentUser = JSON.parse(localStorage.getItem('user'));
      console.log("currentUser:", currentUser);
      console.log("comment:", comment);
      this.currentUser = currentUser;

      if(currentUser) {
        return this.$store.dispatch('comment/likeComment', {
        "comment": comment,
        "currentUserId": currentUser.id
      }).then(() => {
        this.$emit('all-comments');
      
      // if(currentUser) {
      //   return this.$store.dispatch('comment/likeComment', {
      //   "comment": comment,
      //   "currentUserId": currentUser.id
      // }).then(() => {
      //   this.$emit('all-comments');


      // return this.$store.dispatch('comment/allComments').then(res => {
      //   console.log("result:", res.data.comments);
      //   this.allComments = res.data.comments;
      // });

        // this.getAllVotes();
        // this.getAllComments();
        // this.getAllUsers();
        // this.topAgree();
        // this.topDisagree();
        // this.topAlt();
        })
      }
    },

    dislikeComment(comment) {
      const currentUser = JSON.parse(localStorage.getItem('user'));

      if(currentUser) {
        return this.$store.dispatch('comment/dislikeComment', {
          "comment": comment,
          "currentUserId": currentUser.id
        }).then(() => {
        this.$emit('all-comments');

        //   this.getAllComments();
        //   this.getAllVotes();
        //   this.getAllUsers();
        //   this.topAgree();
        //   this.topDisagree();
        //   this.topAlt();
        })
      }
    },

    editComment(comment) {
        this.isEditingComment = !this.isEditingComment;
        this.commentToEdit._id = comment._id;
        this.commentToEdit.body = comment.body;
    },

    updateComment(commentId) {
        this.isEditingComment = !this.isEditingComment;
        return this.$store.dispatch(`comment/editComment`, commentId).then(() => {
            // this.getAllComments();
        });
    },

    cancel() {
      this.isEditingComment = false;
    },

    deleteComment(comment) {

        this.$refs.confirmDialog.show({
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment? It cannot be undone.',
        okButton: 'Delete',
        }).then((res, err) => {
          if (err) {
            res.status(500).send({ message: err });
          }
          if (res) {
              return this.$store.dispatch(`comment/deleteComment`, comment).then(() => {
                // this.getAllComments();
              });
          }
        })
    },
  },

  computed: {
  },

  mounted() {
    console.log("Grabbing all commments");
    // this.thisComment = this.$store.allComments;
  }
}
</script>
<style scoped>

.comment {
  margin: 5px auto;
  /* width: 95%; */
  position: relative;
}

.comment:hover {
  /* border-bottom: 1px solid black; */
}

.comment-body-negative {
  text-decoration: underline 1px solid red;
}

.comment-body-positive {
  text-decoration: underline 1px solid #00aeff;
}

.comment-body-neutral {
  text-decoration: underline 1px solid orange;
}

.comment-edit {
  text-align: center;
  display: inline-block;
}

.comment-edit button {
  color: black;
  background-color: transparent;
  border: 2px solid #00aeff;
  margin: .25em;
}

.comment-edit button:hover {
  color: black;
  background-color: #00aeff;
  border: 2px solid black;
  margin: .25em;
}

.comment-edit-input {

}

 /* ========================Icons================================ */

.arrow-up {
  color: #00aeff;
}

.arrow-up:hover, .arrow-down:hover {
  cursor: pointer;
}

.arrow-down {
  color: red;
}
</style>