using Microsoft.EntityFrameworkCore;
using ASI.Basecode.Data.Models;

namespace ASI.Basecode.Data
{
    public partial class AsiBasecodeDBContext : DbContext
    {
        public AsiBasecodeDBContext(DbContextOptions<AsiBasecodeDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<Course> Courses { get; set; } = null!;
        public virtual DbSet<StudentCourse> StudentCourses { get; set; } = null!;
        public virtual DbSet<GradeFeedback> GradeFeedbacks { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Users
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.UserId).IsUnique();

                entity.Property(u => u.UserId).IsRequired().HasMaxLength(50);
                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.MiddleName).HasMaxLength(50);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Program).HasMaxLength(50);
                entity.Property(u => u.HashedPassword).IsRequired();
                entity.Property(u => u.CreatedTime).IsRequired();
                entity.Property(u => u.Role).IsRequired();
            });

            // Courses
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasIndex(c => c.CourseCode).IsUnique();

                entity.Property(c => c.CourseCode).IsRequired().HasMaxLength(50);
                entity.Property(c => c.CourseName).IsRequired().HasMaxLength(100);
                entity.Property(c => c.CourseDescription).HasMaxLength(1000);
                entity.Property(c => c.UserId).HasMaxLength(50).IsRequired(false);
                entity.Property(c => c.CreatedAt).IsRequired();

                entity.HasOne(c => c.User)
                    .WithMany()
                    .HasForeignKey(c => c.UserId)
                    .HasPrincipalKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // StudentCourse
            modelBuilder.Entity<StudentCourse>(entity =>
            {
                entity.HasIndex(sc => sc.StudentCourseId).IsUnique();

                entity.Property(sc => sc.StudentCourseId).IsRequired().HasMaxLength(50);
                entity.Property(sc => sc.UserId).IsRequired().HasMaxLength(50);
                entity.Property(sc => sc.CourseCode).IsRequired().HasMaxLength(50);
                entity.Property(sc => sc.Grade).IsRequired(false);
                entity.Property(sc => sc.CreatedTime).IsRequired();

                entity.HasOne(sc => sc.User)
                    .WithMany()
                    .HasForeignKey(sc => sc.UserId)
                    .HasPrincipalKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sc => sc.Course)
                    .WithMany()
                    .HasForeignKey(sc => sc.CourseCode)
                    .HasPrincipalKey(c => c.CourseCode)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // GradeFeedback
            modelBuilder.Entity<GradeFeedback>(entity =>
            {
                entity.Property(gf => gf.Feedback).HasMaxLength(1000);
                entity.Property(gf => gf.StudentFeedback).HasMaxLength(1000);
                entity.Property(gf => gf.UserId).HasMaxLength(50).IsRequired(false);
                entity.Property(gf => gf.StudentCourseId).HasMaxLength(50).IsRequired(false);
                entity.Property(gf => gf.CreatedTime).IsRequired();
                entity.Property(gf => gf.UpdatedTime).IsRequired();

                entity.HasOne(gf => gf.User)
                    .WithMany()
                    .HasForeignKey(gf => gf.UserId)
                    .HasPrincipalKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(gf => gf.StudentCourse)
                    .WithMany()
                    .HasForeignKey(gf => gf.StudentCourseId)
                    .HasPrincipalKey(sc => sc.StudentCourseId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
