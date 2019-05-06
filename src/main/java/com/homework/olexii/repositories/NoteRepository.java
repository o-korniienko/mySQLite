package com.homework.olexii.repositories;

import com.homework.olexii.entities.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface NoteRepository extends JpaRepository<Notice, Long> {
}
