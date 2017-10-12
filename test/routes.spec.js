const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const token = require('../token.js');

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage', (done) => {
    chai.request(server)
    .get('/')
    .end( (error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include('BYOB');
      done();
    });
  });

  it('should return a 404 for route that does not exist', (done) => {
    chai.request(server)
    .get('/shenanigans')
    .end( (error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  before( (done) => {
      database.migrate.latest()
        .then( () => done() )
        .catch( (error) => console.log(error) );
    });

    beforeEach( (done) => {
      database.seed.run()
        .then( () => done() )
        .catch( (error) => console.log(error) );
    });

    describe('POST /api/v1/user/authenticate', () => {
      it('should generate a token for new user', (done) => {
        chai.request(server)
          .post('/api/v1/user/authenticate')
          .send({
            email: 'marlin@turing.io',
            app_name: 'wallabies'
          })
          .end( (error, response) => {
            response.should.have.status(201);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('token');
            done();
          });
      });

      it('should not return a token if missing data', (done) => {
        chai.request(server)
          .post('/api/v1/user/authenticate')
          .send({
            name: 'max'
          })
          .end( (error, response) => {
            response.should.have.status(422);
            response.body.error.should.equal('You are missing a required parameter. Please include both email address and the name of your application.');
            done();
          });
      });
    });

    describe('GET /api/v1/ports', () => {
      it('should retrieve all ports', (done) => {
        chai.request(server)
          .get('/api/v1/ports')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(6);
            response.body[0].should.have.property('id');
            response.body[0].should.have.property('port_name');
            response.body[0].should.have.property('port_locode');
            response.body[0].should.have.property('port_max_vessel_size');
            response.body[0].should.have.property('port_total_ships');
            response.body[0].should.have.property('port_country');
            response.body[0].should.have.property('port_usage');
            response.body[0].port_usage.should.have.property('cargo_vessels');
            response.body[0].port_usage.should.have.property('fishing_vessels');
            response.body[0].port_usage.should.have.property('various_vessels');
            response.body[0].port_usage.should.have.property('tanker_vessels');
            response.body[0].port_usage.should.have.property('tug_offshore_supply_vessels');
            response.body[0].port_usage.should.have.property('passenger_vessels');
            response.body[0].port_usage.should.have.property('authority_military_vessels');
            response.body[0].port_usage.should.have.property('sailing_vessels');
            response.body[0].port_usage.should.have.property('aid_to_nav_vessels');
            response.body[0].port_usage.should.have.property('port_id');
            done();
          });
      });

      it('should return a 404 if the url is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/portsss')
        .end( (error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('GET /api/v1/port-usage', () => {
      it('should retrieve all port-usage', (done) => {
        chai.request(server)
          .get('/api/v1/port-usage')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(6);
            response.body[0].should.have.property('cargo_vessels');
            response.body[0].should.have.property('fishing_vessels');
            response.body[0].should.have.property('various_vessels');
            response.body[0].should.have.property('tanker_vessels');
            response.body[0].should.have.property('tug_offshore_supply_vessels');
            response.body[0].should.have.property('passenger_vessels');
            response.body[0].should.have.property('authority_military_vessels');
            response.body[0].should.have.property('sailing_vessels');
            response.body[0].should.have.property('aid_to_nav_vessels');
            response.body[0].should.have.property('port_id');
            done();
          });
      });

      it('should return a 404 if the url is incorrect', (done) => {
        chai.request(server)
          .get('/api/v1/port-usageee')
          .end( (error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('GET /api/v1/ships', () => {
      it('should retrieve all ships', (done) => {
        chai.request(server)
          .get('/api/v1/ships')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(300);
            response.body[0].should.have.property('id');
            response.body[0].should.have.property('ship_name');
            response.body[0].should.have.property('ship_country');
            response.body[0].should.have.property('ship_type');
            response.body[0].should.have.property('ship_length');
            response.body[0].should.have.property('ship_imo');
            response.body[0].should.have.property('ship_status');
            response.body[0].should.have.property('ship_mmsi_callsign');
            response.body[0].should.have.property('ship_current_port');
            done();
          });
      });

      it('should return a 404 if the url is incorrect', (done) => {
        chai.request(server)
          .get('/api/v1/shipsss')
          .end( (error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });




});
