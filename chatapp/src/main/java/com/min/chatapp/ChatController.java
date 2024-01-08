package com.min.chatapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RestController
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @CrossOrigin
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> getMsg(@PathVariable String sender,@PathVariable String receiver){
        return chatRepository.mfindBySender(sender,receiver)
                .subscribeOn(Schedulers.boundedElastic());
        //boundedElastic-스레드 갯수가 정해져있고 elastic과 동일하게 수행시간이 오래걸리는 블로킹 작업에 대한 대안으로 사용할 수 있게 최적화 되어있다.
    }

    @CrossOrigin
    @PostMapping("/chat")
    public Mono<Chat> setMsg(@RequestBody Chat chat){
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

    @CrossOrigin
    @GetMapping(value = "chat/roomNum/{roomNum}",produces=MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> findByRoomNumber(@PathVariable Integer roomNum){
        return chatRepository.mfindByRoomNumber(roomNum)
                .subscribeOn(Schedulers.boundedElastic());
    }
}
