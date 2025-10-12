using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ASI.Basecode.Data.Migrations
{
    /// <inheritdoc />
    public partial class ModifyGradeFeedbackSetNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GradeFeedbacks_StudentCourses_StudentCourseId",
                table: "GradeFeedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_GradeFeedbacks_Users_UserId",
                table: "GradeFeedbacks");

            migrationBuilder.AddForeignKey(
                name: "FK_GradeFeedbacks_StudentCourses_StudentCourseId",
                table: "GradeFeedbacks",
                column: "StudentCourseId",
                principalTable: "StudentCourses",
                principalColumn: "StudentCourseId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_GradeFeedbacks_Users_UserId",
                table: "GradeFeedbacks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GradeFeedbacks_StudentCourses_StudentCourseId",
                table: "GradeFeedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_GradeFeedbacks_Users_UserId",
                table: "GradeFeedbacks");

            migrationBuilder.AddForeignKey(
                name: "FK_GradeFeedbacks_StudentCourses_StudentCourseId",
                table: "GradeFeedbacks",
                column: "StudentCourseId",
                principalTable: "StudentCourses",
                principalColumn: "StudentCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_GradeFeedbacks_Users_UserId",
                table: "GradeFeedbacks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
