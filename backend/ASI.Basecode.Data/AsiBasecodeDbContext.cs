using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ASI.Basecode.Data.Models;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data
{
    public partial class AsiBasecodeDBContext : DbContext
    {
        //public AsiBasecodeDBContext()
        //{
        //}

        public AsiBasecodeDBContext(DbContextOptions<AsiBasecodeDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<StudentCourse> StudentCourses { get; set; }
        public virtual DbSet<GradeFeedback> GradeFeedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ALIN: Use Fluent API to add constraints to model
            // User model
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.UserId, "UQ__Users__1788CC4D5F4A160F")
                    .IsUnique();

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.MiddleName)
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Program)
                    .HasMaxLength(100);

                entity.Property(e => e.HashedPassword)
                    .IsRequired();

                entity.Property(e => e.CreatedTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("GETDATE()");   // Only for SQL Server, adds default datetime as current datetime

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasDefaultValue(UserRoles.Student)  // Defaults to Student
                    .HasConversion<string>();   // Stores role as string instead of int
            });

            // Course model
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasIndex(e => e.CourseCode, "UQ__Courses__CourseCode")
                    .IsUnique();

                entity.Property(e => e.CourseCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CourseName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.CourseDescription)
                    .HasMaxLength(1000);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UserId)
                    .IsRequired(false)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                // Relationship: Course has one Teacher (User)
                entity.HasOne(c => c.User)
                    .WithMany()
                    .HasForeignKey(c => c.UserId)
                    .HasPrincipalKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.SetNull); // Set Null
            });

            // StudentCourse configuration (many-to-many junction table)
            modelBuilder.Entity<StudentCourse>(entity =>
            {
                entity.HasIndex(sc => sc.StudentCourseId, "UQ__StudentCourses__StudentCourseId")
                    .IsUnique();

                entity.Property(e => e.StudentCourseId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CourseCode)
                    .IsRequired()
                    .HasMaxLength(50);

                // Relationships
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

            // GradeFeedback configuration
            modelBuilder.Entity<GradeFeedback>(entity =>
            {
                entity.Property(e => e.Feedback)
                    .IsRequired()
                    .HasMaxLength(1000);

                entity.Property(e => e.CreatedTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UserId)
                    .IsRequired(false)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.StudentCourseId)
                    .IsRequired()
                    .HasMaxLength(50);

                // Relationships
                entity.HasOne(gf => gf.User)
                    .WithMany()
                    .HasForeignKey(gf => gf.UserId)
                    .HasPrincipalKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(gf => gf.StudentCourse)
                    .WithMany()
                    .HasForeignKey(gf => gf.StudentCourseId)
                    .HasPrincipalKey(u => u.StudentCourseId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
