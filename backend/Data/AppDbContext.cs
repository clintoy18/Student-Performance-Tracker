using Microsoft.EntityFrameworkCore;
using Student_Performance_Tracker_React_Asp.Server.Model;
using System.Collections.Generic;

namespace Student_Performance_Tracker_React_Asp.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Degree> Degrees { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<CourseDetaills> CourseDetaills { get; set; }
        public DbSet<StudentCourseList> StudentCourseList { get; set; }
        public DbSet<CourseGrade> CourseGrades { get; set; }
        public DbSet<GradeFeedback> GradeFeedback { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User -> Degree relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.Degree)
                .WithMany()
                .HasForeignKey(u => u.DegreeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Degree Seeder
            modelBuilder.Entity<Degree>().HasData(
                new Degree { Id = 1, Name = "Bachelor of Science in Computer Science" },
                new Degree { Id = 2, Name = "Bachelor of Science in Information Technology" },
                new Degree { Id = 3, Name = "Bachelor of Science in Information Systems" },
                new Degree { Id = 4, Name = "Bachelor of Science in Software Engineering" }
            );

            // Role Seeder
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "Teacher" },
                new Role { RoleId = 3, RoleName = "Student" }
            );
        }
    }
}
