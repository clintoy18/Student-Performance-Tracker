using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ASI.Basecode.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrateSQLite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    MiddleName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    HashedPassword = table.Column<string>(type: "TEXT", nullable: false),
                    Program = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Role = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.UniqueConstraint("AK_Users_UserId", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CourseCode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CourseName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CourseDescription = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.UniqueConstraint("AK_Courses_CourseCode", x => x.CourseCode);
                    table.ForeignKey(
                        name: "FK_Courses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "StudentCourses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StudentCourseId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CourseCode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Grade = table.Column<decimal>(type: "TEXT", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentCourses", x => x.Id);
                    table.UniqueConstraint("AK_StudentCourses_StudentCourseId", x => x.StudentCourseId);
                    table.ForeignKey(
                        name: "FK_StudentCourses_Courses_CourseCode",
                        column: x => x.CourseCode,
                        principalTable: "Courses",
                        principalColumn: "CourseCode",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentCourses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GradeFeedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Feedback = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    StudentFeedback = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    StudentCourseId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedTime = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GradeFeedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GradeFeedbacks_StudentCourses_StudentCourseId",
                        column: x => x.StudentCourseId,
                        principalTable: "StudentCourses",
                        principalColumn: "StudentCourseId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_GradeFeedbacks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CourseCode",
                table: "Courses",
                column: "CourseCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_UserId",
                table: "Courses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GradeFeedbacks_StudentCourseId",
                table: "GradeFeedbacks",
                column: "StudentCourseId");

            migrationBuilder.CreateIndex(
                name: "IX_GradeFeedbacks_UserId",
                table: "GradeFeedbacks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCourses_CourseCode",
                table: "StudentCourses",
                column: "CourseCode");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCourses_StudentCourseId",
                table: "StudentCourses",
                column: "StudentCourseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentCourses_UserId",
                table: "StudentCourses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserId",
                table: "Users",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GradeFeedbacks");

            migrationBuilder.DropTable(
                name: "StudentCourses");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
