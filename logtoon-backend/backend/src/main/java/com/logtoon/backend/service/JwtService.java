package com.logtoon.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(@Value("${jwt.secret}")String secret){
        byte[] keyBytes= Decoders.BASE64.decode(secret);
        this.secretKey= Keys.hmacShaKeyFor(keyBytes);
    }

    //Learn about refresh tokens and apply it later on
    public String generateToken(String username){
        Map<String,Object> claims=new HashMap<>();


        String token= Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000L*60*60))
                .signWith(this.secretKey,Jwts.SIG.HS256)
                .compact();

        System.out.println(token);
        return token;
    }

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver){
        final Claims claims=extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(this.secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUsername(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }



//    public static void main(String[] args) throws NoSuchAlgorithmException {
//        KeyGenerator keyGen =
//                KeyGenerator.getInstance("HmacSHA256");
//
//        SecretKey key = keyGen.generateKey();
//
//        System.out.println(
//                Base64.getEncoder()
//                        .encodeToString(key.getEncoded())
//        );
//    }


}
